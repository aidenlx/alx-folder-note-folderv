import { debounce, PluginSettingTab, Setting } from "obsidian";

import Folderv from "./fv-main";

export const noHideNoteMark = "alx-no-hide-note";
export const folderIconMark = "alx-folder-icons";

export interface FoldervSettings {
  h1AsTitleSource: boolean;
  briefMax: number;
  titleField: string;
  descField: string;
}

export const DEFAULT_SETTINGS: FoldervSettings = {
  h1AsTitleSource: true,
  briefMax: 128,
  titleField: "title",
  descField: "description",
};

export class FoldervSettingTab extends PluginSettingTab {
  constructor(public plugin: Folderv) {
    super(plugin.app, plugin);
  }

  display(): void {
    let { containerEl } = this;
    containerEl.empty();
    this.renderFoldervSettings(containerEl);
  }

  renderFoldervSettings(containerEl: HTMLElement) {
    this.setH1AsTitle(containerEl);
    this.setBriefMax(containerEl);
    this.setTitleDescField(containerEl);
  }

  setBriefMax(containerEl: HTMLElement) {
    const isPositiveInteger = (number: string) =>
      Number.isInteger(+number) && +number > 0;
    const { settings } = this.plugin;
    new Setting(containerEl)
      .setName("Maximum Brief Length")
      .setDesc(
        "Maximum length of brief generated from 1st paragraph of notes when not description field is set in frontmatter",
      )
      .addText((text) => {
        const save = debounce(
          async (value: string) => {
            settings.briefMax = +value;
            await this.plugin.saveSettings();
          },
          500,
          true,
        );
        text
          .setValue(settings.briefMax.toString())
          .onChange(async (value: string) => {
            text.inputEl.toggleClass("incorrect", !isPositiveInteger(value));
            if (isPositiveInteger(value)) save(value);
          });
      });
  }
  setH1AsTitle(containerEl: HTMLElement) {
    const { settings } = this.plugin;
    new Setting(containerEl)
      .setName("Use First Heading 1 as File Title")
      .setDesc(
        "Applied when title field is not set in the frontmatter, fallback to filename when no Heading 1 found",
      )
      .addToggle((toggle) =>
        toggle.setValue(settings.h1AsTitleSource).onChange(async (value) => {
          settings.h1AsTitleSource = value;
          await this.plugin.saveSettings();
        }),
      );
  }
  setTitleDescField(containerEl: HTMLElement) {
    const { settings } = this.plugin;
    new Setting(containerEl)
      .setName("Title Field Name")
      .setDesc("Used to find title set in note's frontmatter")
      .addText((text) => {
        const save = debounce(
          async (value: string) => {
            settings.titleField = value;
            await this.plugin.saveSettings();
          },
          500,
          true,
        );
        text
          .setValue(settings.titleField)
          .onChange(async (value: string) => save(value));
      });
    new Setting(containerEl)
      .setName("Description Field Name")
      .setDesc("Used to find description set in note's frontmatter")
      .addText((text) => {
        const save = debounce(
          async (value: string) => {
            settings.descField = value;
            await this.plugin.saveSettings();
          },
          500,
          true,
        );
        text
          .setValue(settings.descField)
          .onChange(async (value: string) => save(value));
      });
  }
}
