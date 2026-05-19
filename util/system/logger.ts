import EC from "eight-colors";

type Severity = "info" | "warn" | "error" | "debug";

const colorBy: Record<Severity, (s: string) => string> = {
    info: EC.green,
    warn: EC.yellow,
    error: EC.red,
    debug: EC.magenta
};

function emit(severity: Severity, message: string, ...args: unknown[]): void {
    const tag = colorBy[severity](`[${severity.toUpperCase()}]`);
    console.log(`${tag} ${message}`, ...args);
}

export const logger = {
    info: (m: string, ...a: unknown[]) => emit("info", m, ...a),
    warn: (m: string, ...a: unknown[]) => emit("warn", m, ...a),
    error: (m: string, ...a: unknown[]) => emit("error", m, ...a),
    debug: (m: string, ...a: unknown[]) => {
        if (process.env.DEBUG) emit("debug", m, ...a);
    }
};
