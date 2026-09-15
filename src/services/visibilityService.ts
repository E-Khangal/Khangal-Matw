export interface TopicSectionVisibility {
  theory: boolean;
  examples: boolean;
  practice: boolean;
  test1: boolean;
  test2: boolean;
  test3: boolean;
  answers: boolean;
}

export interface VisibilitySettings {
  defaultSections: TopicSectionVisibility;
  topicOverrides: Record<string, Partial<TopicSectionVisibility>>;
  hiddenTopicIds: string[];
}

const STORAGE_KEY = 'mongolian_math_visibility_settings_v1';

const DEFAULT_SETTINGS: VisibilitySettings = {
  defaultSections: {
    theory: true,
    examples: true,
    practice: true,
    test1: false,
    test2: false,
    test3: false,
    answers: false,
  },
  topicOverrides: {},
  hiddenTopicIds: [],
};

class VisibilityService {
  private getSettings(): VisibilitySettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      return {
        defaultSections: { ...DEFAULT_SETTINGS.defaultSections, ...(parsed.defaultSections || {}) },
        topicOverrides: parsed.topicOverrides || {},
        hiddenTopicIds: Array.isArray(parsed.hiddenTopicIds) ? parsed.hiddenTopicIds : [],
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  private saveSettings(settings: VisibilitySettings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('visibility-settings-updated'));
    } catch (e) {
      console.error('Failed to save visibility settings', e);
    }
  }

  /**
   * Get effective section visibility for a given topic
   */
  getTopicVisibility(topicId: string): TopicSectionVisibility {
    const settings = this.getSettings();
    const override = settings.topicOverrides[topicId] || {};
    return {
      ...settings.defaultSections,
      ...override,
    };
  }

  /**
   * Check if a topic is hidden from regular users
   */
  isTopicHidden(topicId: string): boolean {
    const settings = this.getSettings();
    return settings.hiddenTopicIds.includes(topicId);
  }

  /**
   * Update visibility for a specific topic
   */
  setTopicVisibility(topicId: string, visibility: TopicSectionVisibility) {
    const settings = this.getSettings();
    settings.topicOverrides[topicId] = visibility;
    this.saveSettings(settings);
  }

  /**
   * Toggle a specific section for a topic
   */
  toggleTopicSection(topicId: string, sectionKey: keyof TopicSectionVisibility, isVisible: boolean) {
    const current = this.getTopicVisibility(topicId);
    current[sectionKey] = isVisible;
    this.setTopicVisibility(topicId, current);
  }

  /**
   * Toggle topic visibility (hide/show topic in user list)
   */
  setTopicHidden(topicId: string, hidden: boolean) {
    const settings = this.getSettings();
    if (hidden) {
      if (!settings.hiddenTopicIds.includes(topicId)) {
        settings.hiddenTopicIds.push(topicId);
      }
    } else {
      settings.hiddenTopicIds = settings.hiddenTopicIds.filter((id) => id !== topicId);
    }
    this.saveSettings(settings);
  }

  /**
   * Apply a topic's configuration to all topics as default
   */
  applyAsDefault(topicId: string) {
    const current = this.getTopicVisibility(topicId);
    const settings = this.getSettings();
    settings.defaultSections = { ...current };
    this.saveSettings(settings);
  }

  getAllSettings(): VisibilitySettings {
    return this.getSettings();
  }
}

export const visibilityService = new VisibilityService();
