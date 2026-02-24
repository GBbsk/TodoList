function baseId() {
  return crypto.randomUUID();
}

export function gerarIdTask() {
  return `task-${baseId()}`;
}