# Touch Grass

Block doom scrolling sites and reclaim your peace of mind. A browser extension that blocks LinkedIn, Instagram, Threads, Drudge Report, and Reddit feeds (while still allowing individual Reddit post pages).

## Installing the Extension

### Firefox

The Firefox extension uses Manifest V2 and must be loaded as a temporary add-on (reloaded after each browser restart).

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click **"Load Temporary Add-on..."**
3. Navigate to the project root and select `manifest.json`

> **Note:** Temporary add-ons are removed when Firefox restarts. You'll need to repeat these steps each time.

### Safari

The Safari version is a Web Extension built with Xcode.

1. Open `TouchGrass-Safari/Touch Grass/Touch Grass.xcodeproj` in Xcode
2. Build & Run (Cmd+R)
3. In Safari, go to **Settings > Extensions** and enable "Touch Grass"
4. If the extension doesn't appear, enable unsigned extensions:
   - **Safari > Settings > Advanced** > check **"Show features for web developers"**
   - **Develop menu > Allow Unsigned Extensions**

> **Note:** You need to allow unsigned extensions again each time Safari restarts.
