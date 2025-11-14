// Nome do arquivo: ./frontend/src/setupTests.ts
// Finalidade: Configuração de testes para o frontend.
import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock para govbr-ds-button
window.customElements.define(
  'govbr-ds-button',
  class extends HTMLElement {
    connectedCallback(this: HTMLElement): void {
      const button = document.createElement('button')
      button.setAttribute('type', this.getAttribute('type') || 'button')
      button.setAttribute('aria-label', this.getAttribute('aria-label') || '')
      button.innerHTML = this.innerHTML
      this.replaceWith(button)
    }
  }
)

// Silenciar avisos do console
vi.spyOn(console, 'warn').mockImplementation(() => {})
