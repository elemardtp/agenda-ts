// Nome do arquivo: ./frontend/src/types.d.ts
// Finalidade: Declarações de tipos para componentes GovBR.
declare namespace JSX {
  interface IntrinsicElements {
    'br-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      label?: string
      href?: string
    }
  }
}
