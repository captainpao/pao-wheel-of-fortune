import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { heroIcons } from '../utils/icons';

@customElement('greeting-card')
export class GreetingCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    svg {
      display: block;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
  `;

  createRenderRoot() {
    return this; // disable shadow DOM to allow global styles
  }

  private _name = 'World';
  private _showIcon = false;

  @property({ type: String })
  get name() {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
    this.requestUpdate();
  }

  @property({ type: Boolean })
  get showIcon() {
    return this._showIcon;
  }
  set showIcon(value: boolean) {
    this._showIcon = value;
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
        <div class="md:flex">
          <div class="p-8">
            <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Welcome
            </div>
            <h2 class="block mt-1 text-lg leading-tight font-medium text-black">
              Hello, ${this.name}!
            </h2>
            <p class="mt-2 text-slate-500">
              This is a sample Lit component styled with Tailwind CSS.
            </p>
            
            ${this.showIcon
              ? html`
                  <div class="mt-4 flex items-center">
                    <span class="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full">
                      ${unsafeHTML(heroIcons.bolt)}
                    </span>
                    <span class="ml-3 text-sm text-slate-600">With Heroicon integration</span>
                  </div>
                `
              : ''}
          </div>
        </div>
      </div>
    `;
  }
}