/**
 * Harness Python executado uma única vez dentro do Pyodide.
 *
 * Responsabilidades:
 *  1. Executar o código do aluno com semântica de REPL — se a última
 *     instrução for uma expressão, seu valor é exibido com `str()`
 *     (é a convenção usada pelas 66 lições do curso).
 *  2. Avaliar os `tests` de cada exercício e comparar com o esperado
 *     de forma tolerante (números com folga, listas elemento a elemento).
 *  3. Devolver traceback enxuto, mostrando apenas as linhas do aluno.
 */
export const HARNESS_PY = String.raw`
import ast, io, json, math, contextlib, traceback

_ARQ = "<seu codigo>"


def _oikos_render(v):
    """Como o valor aparece para o aluno (mesma convencao das licoes)."""
    return str(v)


def _oikos_compare(actual, expected):
    if expected is None:
        return actual is None
    if isinstance(expected, bool):
        return isinstance(actual, bool) and actual == expected
    if isinstance(expected, (int, float)):
        if isinstance(actual, bool):
            return False
        try:
            return math.isclose(float(actual), float(expected), rel_tol=1e-9, abs_tol=1e-9)
        except (TypeError, ValueError):
            return str(actual).strip() == str(expected).strip()
    if isinstance(expected, (list, tuple)):
        try:
            a = list(actual)
        except TypeError:
            return False
        if len(a) != len(expected):
            return False
        return all(_oikos_compare(x, y) for x, y in zip(a, expected))
    alvo = str(expected).strip()
    return str(actual).strip() == alvo or repr(actual).strip() == alvo


def _oikos_fmt_expected(exp):
    if exp is None:
        return "None"
    if isinstance(exp, bool):
        return "True" if exp else "False"
    return str(exp)


def _oikos_traceback(exc):
    """Traceback com apenas os quadros do codigo do aluno."""
    linhas = []
    tb = exc.__traceback__
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == _ARQ:
            linhas.append("  linha %d, em %s" % (tb.tb_lineno, tb.tb_frame.f_code.co_name))
        tb = tb.tb_next
    cabeca = ["Erro ao executar seu codigo:"]
    if linhas:
        cabeca += linhas
    cabeca += [t.rstrip("\n") for t in traceback.format_exception_only(type(exc), exc)]
    return "\n".join(cabeca).strip()


def _oikos_run(code, tests_json):
    tests = json.loads(tests_json) if tests_json else []
    escopo = {"__name__": "__main__"}
    saida, saida_err = io.StringIO(), io.StringIO()
    erro = None
    valor_final = None

    try:
        arvore = ast.parse(code, filename=_ARQ)
    except SyntaxError as e:
        return json.dumps({
            "stdout": "", "stderr": "",
            "error": "Erro de sintaxe na linha %s: %s" % (e.lineno, e.msg),
            "result": None, "testsPassed": False, "testResults": [],
        })

    cauda = None
    if arvore.body and isinstance(arvore.body[-1], ast.Expr):
        ultimo = arvore.body.pop()
        cauda = ast.Expression(ultimo.value)
        ast.copy_location(cauda, ultimo)

    try:
        with contextlib.redirect_stdout(saida), contextlib.redirect_stderr(saida_err):
            exec(compile(arvore, _ARQ, "exec"), escopo)
            if cauda is not None:
                v = eval(compile(cauda, _ARQ, "eval"), escopo)
                if v is not None:
                    valor_final = _oikos_render(v)
                    print(valor_final)
    except BaseException as e:
        erro = _oikos_traceback(e)

    resultados = []
    if erro is None:
        for t in tests:
            expr = t.get("expression", "")
            esperado = t.get("expected")
            try:
                v = eval(expr, escopo)
                ok = _oikos_compare(v, esperado)
                obtido = _oikos_render(v)
            except BaseException as e:
                ok = False
                obtido = "%s: %s" % (type(e).__name__, e)
            resultados.append({
                "expression": expr,
                "passed": bool(ok),
                "expected": _oikos_fmt_expected(esperado),
                "actual": obtido,
            })

    # Sem testes declarados, o exercicio e "rode e observe":
    # passa desde que o codigo execute sem erro.
    passou = erro is None and all(r["passed"] for r in resultados)

    return json.dumps({
        "stdout": saida.getvalue(),
        "stderr": saida_err.getvalue(),
        "error": erro,
        "result": valor_final,
        "testsPassed": passou,
        "testResults": resultados,
    })
`;
