# TaskFlow • Modern Task Management Application

A complete, modern, responsive productivity and task management web application built strictly with **HTML5**, **CSS3**, **Vanilla JavaScript**, and **LocalStorage**. Designed with a mobile-first architecture ready for seamless packaging into an Android APK using **Capacitor** and **Android Studio**.

---

## 1. Project Structure

```text
Exp3-TaskManagement/
│
├── index.html              # Core semantic HTML5 application shell & view templates
├── style.css               # Clean modern CSS3 design system, responsive layouts & themes
├── script.js               # Modular Vanilla JS application logic, CRUD & state engine
│
├── assets/
│   ├── favicon.svg         # Vector branding favicon
│   └── icons/
│       └── app-icon.svg    # 512x512 vector icon for Android / Capacitor packaging
│
└── README.md               # Complete documentation & Android APK build guide
```

---

## 2. Key Features

- **Pure Vanilla Stack**: Zero frameworks (No React, Vue, Angular, TypeScript, Tailwind, or Bootstrap). Zero external library dependencies.
- **LocalStorage Persistence**: Full automatic persistence for tasks, dark/light theme preferences, and activity notifications.
- **Multi-View Navigation**:
  - **Dashboard**: High-level productivity metrics, 4 dynamic statistics cards (Total, Pending, In Progress, Completed), Today's focus preview, and urgent priority tasks.
  - **All Tasks**: Complete interactive table/grid with multi-criteria status filtering, category filtering, priority filtering, and multiple sort orders.
  - **Today's Tasks**: Automatically filters tasks due today and groups them into timeline buckets:
    - 🌅 **Morning** (Before 12:00 PM)
    - ☀️ **Afternoon** (12:00 PM – 5:00 PM)
    - 🌙 **Evening & Night** (After 5:00 PM)
  - **Upcoming Tasks**: Future tasks organized chronologically by date with countdown indicators.
  - **Completed Tasks**: Archive of accomplished tasks with timestamps, one-click restore, and clear-all capabilities.
- **Real-Time Live Search**: Instant debounced search querying across task title, description, and category.
- **Interactive Modals & Validation**:
  - Add / Edit Task Modal with field validation (title required, valid due date, error messaging).
  - Custom non-blocking Delete Confirmation Modal.
- **Non-Intrusive Notifications**:
  - Animated custom toast alerts (Success, Info, Warning, Danger).
  - Slide-out Activity & Alerts Drawer with chronological logs.
- **Theme Switcher**: Instant toggle between modern clean Light Mode (`#F6F8FC`, `#FFFFFF`) and sleek Dark Mode (`#0F172A`, `#1E293B`) stored in LocalStorage.
- **Mobile-First & Capacitor Ready**:
  - Fully responsive from 320px mobile screens to large desktop monitors.
  - Safe-area insets (`viewport-fit=cover`), touch feedback, bottom navigation bar with elevated action button (FAB).

---

## 3. How to Run Locally

You can run TaskFlow locally without any server dependencies:

### Option A: Open Directly in Browser
Double-click `index.html` or right-click `index.html` → **Open With** → Google Chrome, Microsoft Edge, or Mozilla Firefox.

### Option B: Using VS Code Live Server
1. Open the `Exp3-TaskManagement` folder in VS Code.
2. If installed, right-click `index.html` and select **"Open with Live Server"**.
3. The app will launch automatically at `http://127.0.0.1:5500/index.html`.

### Option C: Using Python HTTP Server (Built-in)
In PowerShell or terminal inside the `Exp3-TaskManagement` folder:
```powershell
python -m http.server 3000
```
Open your browser and navigate to:
```text
http://localhost:3000
```

### Option D: Using Node.js `npx serve`
```powershell
npx serve .
```

---

## 4. How to Test on Mobile Browser

### Step 1: Device Emulation in Chrome DevTools
1. Press `F12` or `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac) to open Chrome DevTools.
2. Click the **Toggle device toolbar** button (or press `Ctrl + Shift + M`).
3. Select a mobile device profile (e.g., **Pixel 7**, **iPhone 14**, or **Samsung Galaxy S20**).
4. Test:
   - Mobile top header & hamburger menu drawer.
   - Mobile bottom navigation bar.
   - Floating Action Button (+) opening the Add Task modal.
   - Smooth swipe/touch interactions.

### Step 2: Testing on a Physical Phone (Local Wi-Fi)
1. Ensure your PC and phone are connected to the same Wi-Fi network.
2. Find your PC's local IP address:
   - On Windows: Run `ipconfig` in PowerShell and look for **IPv4 Address** (e.g., `192.168.1.15`).
3. Start a local server:
   ```powershell
   python -m http.server 3000 --bind 0.0.0.0
   ```
4. On your mobile phone browser (Chrome/Safari), enter:
   ```text
   http://<YOUR_PC_IP>:3000
   ```
   *(Example: `http://192.168.1.15:3000`)*

---

## 5. Complete Guide: Convert into Android APK with Capacitor

This application is 100% compatible with **Capacitor** to compile into a native Android APK. Follow these exact steps:

### Prerequisites
1. **Node.js** (v18 or higher) installed on your computer: [nodejs.org](https://nodejs.org/)
2. **Android Studio** installed with Android SDK & command-line tools: [developer.android.com/studio](https://developer.android.com/studio)
3. **Java Development Kit (JDK 17 or 21)** installed (bundled with Android Studio).

---

### Step-by-Step Instructions

#### Step 1: Initialize npm in the Project Folder
Open PowerShell inside `d:\Dev\Projects\App Development projects\Exp3-TaskManagement` and run:

```powershell
npm init -y
```

#### Step 2: Install Capacitor Core, CLI, and Android Platform
```powershell
npm install @capacitor/core @capacitor/cli @capacitor/android
```

#### Step 3: Initialize Capacitor Project
Run the initialization command:
```powershell
npx cap init
```
Provide the prompts:
- **App name**: `TaskFlow`
- **App Package ID**: `com.taskflow.app`
- **Web asset directory**: `.` *(use dot or current folder where index.html resides)*

Alternatively, create or verify `capacitor.config.json` (or `capacitor.config.ts`):
```json
{
  "appId": "com.taskflow.app",
  "appName": "TaskFlow",
  "webDir": ".",
  "bundledWebRuntime": false
}
```

#### Step 4: Add Android Native Platform
```powershell
npx cap add android
```
This command generates an `android/` native project folder with all required Gradle scripts and configurations.

#### Step 5: Sync Web Code into Android Project
Whenever you edit `index.html`, `style.css`, or `script.js`, sync the changes into the Android assets:
```powershell
npx cap sync android
```

#### Step 6: Open in Android Studio
Launch Android Studio with the project loaded:
```powershell
npx cap open android
```
*(Or launch Android Studio manually, choose **Open**, and navigate to the `android/` subfolder inside `Exp3-TaskManagement`)*.

---

## 6. Generate the APK in Android Studio

1. Wait for Android Studio to finish Gradle Sync and indexing (shown at the bottom status bar).
2. Go to the top menu bar in Android Studio:
   - Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
3. Gradle will compile the project. When finished, a notification popup will appear at the bottom right:
   > *"APK(s) generated successfully for 1 module: app"*
4. Click the blue **"locate"** link in the popup.
   - Alternatively, navigate directly in your file explorer to:
     ```text
     Exp3-TaskManagement/android/app/build/outputs/apk/debug/app-debug.apk
     ```
5. `app-debug.apk` is your fully functional Android APK!

---

## 7. Transfer and Install the APK on an Android Phone

### Method 1: USB Transfer
1. Connect your Android phone to your PC via a USB cable.
2. On your phone, set the USB connection mode to **File Transfer / MTP**.
3. Copy `app-debug.apk` to your phone's **Downloads** or **Internal Storage** folder.
4. On your phone, open the **Files** or **My Files** app, navigate to the APK, and tap it.
5. If prompted with *"Install unknown apps"*, tap **Settings** and allow your browser/file manager to install apps from this source.
6. Tap **Install** → **Open**.

### Method 2: Cloud / WhatsApp / Drive Transfer
1. Upload `app-debug.apk` to your Google Drive, Dropbox, or send it to yourself on WhatsApp/Telegram.
2. On your Android phone, download `app-debug.apk`.
3. Tap the downloaded file to install and open TaskFlow!

### Method 3: Direct Run from Android Studio
1. Enable **Developer Options** and **USB Debugging** on your Android phone.
2. Connect your phone via USB.
3. In Android Studio, select your physical phone in the device dropdown list and click the green **Play** button (Run 'app').
4. The app will install and open automatically on your phone.

---

## 8. College Project Evaluation Highlights

When presenting this project for evaluation or viva, highlight these technical achievements:
1. **Zero External Frontend Frameworks**: Built using standard Web Standards (HTML5 semantics, modern CSS3 layout and custom properties, ES6+ modules).
2. **Capacitor Android Architecture**: Designed for hybrid native mobile application packaging with safe area insets and mobile navigation patterns.
3. **Data Integrity & Storage**: Uses structured JSON storage in browser LocalStorage with automatic schema initializers and fault tolerance.
4. **Rich UX Details**: Micro-animations, responsive time-bucketed Today views, non-blocking toast notifications, and dark mode contrast ratios meeting WCAG accessibility guidelines.
