/*
  Notices
  - Pequeno componente de exibição de mensagens de sucesso/erro.
  - Usa `aria-live` para que leitores de tela notifiquem mudanças de estado.
*/

type NoticesProps = {
  message: string;
  error: string;
};

export function Notices({ message, error }: NoticesProps) {
  return (
    <>
      {message ? (
        <div className="notice-success" role="status" aria-live="polite">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="notice-error" role="alert" aria-live="assertive">
          {error}
        </div>
      ) : null}
    </>
  );
}
