import { calculateAudioDuration } from "../../utils/audioUtils";

export const durationService = {
  cache: new Map(),

  async getTrackDuration(track, shouldUpdate = false) {
    const cacheKey = track.id;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (track.duration && track.duration !== "--:--") {
      this.cache.set(cacheKey, track.duration);
      return track.duration;
    }

    if (track.audioUrl) {
      try {
        const duration = await calculateAudioDuration(track.audioUrl);
        this.cache.set(cacheKey, duration);

        if (
          shouldUpdate &&
          duration !== "--:--" &&
          duration !== track.duration
        ) {
          try {
            const { trackService } = await import("./trackService");
            await trackService.updateTrack(track.id, { duration });
          } catch (updateError) {
            console.warn(
              `Could not update duration for track ${track.id}:`,
              updateError.message
            );
          }
        }

        return duration;
      } catch (error) {
        console.error(
          `Error calculating duration for track ${track.id}:`,
          error
        );
        const fallback = "--:--";
        this.cache.set(cacheKey, fallback);
        return fallback;
      }
    }

    return "--:--";
  },

  async getMultipleTrackDurations(tracks, shouldUpdate = false) {
    const results = await Promise.all(
      tracks.map(async (track) => ({
        ...track,
        duration: await this.getTrackDuration(track, shouldUpdate),
      }))
    );

    return results;
  },

  clearCache() {
    this.cache.clear();
  },
};
