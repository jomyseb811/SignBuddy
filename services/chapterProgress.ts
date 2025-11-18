// services/chapterProgress.ts
// Simple in-memory state management for chapter progress
// In a real app, this would use AsyncStorage or a database

class ChapterProgressService {
  private completedChapters: Set<number> = new Set();
  private listeners: Array<(completedChapters: number[]) => void> = [];

  // Get the list of completed chapters
  getCompletedChapters(): number[] {
    return Array.from(this.completedChapters);
  }

  // Check if a chapter is unlocked (chapter 1 is always unlocked)
  isChapterUnlocked(chapterId: number): boolean {
    if (chapterId === 1) return true;
    return this.completedChapters.has(chapterId - 1);
  }

  // Mark a chapter as completed
  completeChapter(chapterId: number): void {
    if (!this.completedChapters.has(chapterId)) {
      this.completedChapters.add(chapterId);
      this.notifyListeners();
    }
  }

  // Reset all progress (useful for testing)
  resetProgress(): void {
    this.completedChapters.clear();
    this.notifyListeners();
  }

  // Complete all chapters up to a certain point (useful for testing)
  completeChaptersUpTo(chapterId: number): void {
    for (let i = 1; i <= chapterId; i++) {
      this.completedChapters.add(i);
    }
    this.notifyListeners();
  }

  // Subscribe to changes in chapter progress
  subscribe(listener: (completedChapters: number[]) => void): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of changes
  private notifyListeners(): void {
    const completedArray = this.getCompletedChapters();
    this.listeners.forEach(listener => listener(completedArray));
  }
}

// Export a singleton instance
export const chapterProgressService = new ChapterProgressService();