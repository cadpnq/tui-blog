import { h, FunctionComponent } from "preact";
import "./Menu.styl";
import { useSettings } from "../util/Settings";
import { useState } from "preact/hooks";

export const SideMenu: FunctionComponent = () => {
  const { settings, setSetting } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  const closedMenu = (
    <>
      <button className="menu-button" onClick={() => setMenuOpen(true)}>
        Menu
      </button>
    </>
  );
  const openMenu = (
    <>
      <div className="menu">
        <button className="item pb-3" onClick={() => setMenuOpen(false)}>
          Exit
        </button>
        <label className="item">
          <input
            type="checkbox"
            checked={settings.blinkLights}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setSetting("blinkLights", target.checked);
            }}
          />
          Blink lights
        </label>
        <label className="item">
          <input
            type="checkbox"
            checked={settings.distortScreen}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setSetting("distortScreen", target.checked);
            }}
          />
          Distort Screen
        </label>
        <label className="item">
          <input
            type="checkbox"
            checked={settings.bloomEffect}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setSetting("bloomEffect", target.checked);
            }}
          />
          Bloom Effect
        </label>
      </div>
    </>
  );

  return menuOpen ? openMenu : closedMenu;
};
