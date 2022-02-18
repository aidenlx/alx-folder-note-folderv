import {
  FolderNoteAPI,
  getApi,
  isPluginEnabled,
} from "@aidenlx/folder-note-core";
import { debounce, Debouncer, Notice, Plugin } from "obsidian";

import { FOLDERV_ID, GetFolderVHandler } from "./components/load";
import {
  DEFAULT_SETTINGS,
  FoldervSettings,
  FoldervSettingTab,
} from "./settings";

export default class Folderv extends Plugin {
  settings: FoldervSettings = DEFAULT_SETTINGS;

  private _notify = (
    id: string,
    message: string | null,
    timeout?: number | undefined,
  ): void => {
    if (message) new Notice(message, timeout);
    this._noticeSender.delete(id);
  };
  private _noticeSender = new Map<
    string,
    Debouncer<Parameters<Folderv["notify"]>>
  >();
  /**
   * @param message set to null to cancel message
   */
  notify = (
    id: string,
    message: string | null,
    timeout?: number | undefined,
  ) => {
    let sender = this._noticeSender.get(id);
    if (sender) sender(id, message, timeout);
    else if (message) {
      const debouncer = debounce(this._notify, 1e3, true);
      this._noticeSender.set(id, debouncer);
      debouncer(id, message, timeout);
    }
  };

  get CoreApi(): FolderNoteAPI {
    let message;
    if (isPluginEnabled(this)) {
      const api = getApi(this);
      if (!api) {
        message = "Error: folder-note-core api not available";
        throw new Error(message);
      } else return api;
    } else {
      message =
        "Failed to initialize alx-folder-note-folderv: folder-note-core plugin not enabled";
      new Notice(message);
      throw new Error(message);
    }
  }

  renderFoldervSettings = (containerEl: HTMLElement) => {
    this.settingTab.renderFoldervSettings(containerEl);
  };

  settingTab = new FoldervSettingTab(this);
  async onload() {
    console.log("loading alx-folder-note-folderv");

    await this.loadSettings();
    this.registerMarkdownCodeBlockProcessor(
      FOLDERV_ID,
      GetFolderVHandler(this),
    );
    if (!this.app.plugins.plugins["alx-folder-note"]) {
      this.addSettingTab(this.settingTab);
    }
  }

  // onunload() {
  //   console.log("unloading alx-folder-note-folderv");
  // }

  async loadSettings() {
    this.settings = { ...this.settings, ...(await this.loadData()) };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
