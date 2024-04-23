import { render } from 'preact'
import { App } from './app'

window.onload = () => render(<App />, document.getElementById('app')!);
