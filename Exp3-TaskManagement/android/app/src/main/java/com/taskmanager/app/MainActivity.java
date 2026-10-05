package com.taskmanager.app;

import android.os.Bundle;
import android.webkit.WebView;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;
import java.util.Locale;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Ensure edge-to-edge window decor so system bars can be properly handled
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // Listen for system bar insets (status bar, display cutout, navigation bar)
        ViewCompat.setOnApplyWindowInsetsListener(getWindow().getDecorView(), (view, windowInsets) -> {
            Insets insets = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
            );

            float density = getResources().getDisplayMetrics().density;
            int top = (int) (insets.top / density);
            int bottom = (int) (insets.bottom / density);
            int left = (int) (insets.left / density);
            int right = (int) (insets.right / density);

            applySafeAreaToWebView(top, bottom, left, right);

            return windowInsets;
        });
    }

    private void applySafeAreaToWebView(int top, int bottom, int left, int right) {
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            String script = String.format(
                Locale.US,
                "try {" +
                "  document.documentElement.style.setProperty('--safe-area-inset-top', '%dpx');" +
                "  document.documentElement.style.setProperty('--safe-area-inset-bottom', '%dpx');" +
                "  document.documentElement.style.setProperty('--safe-area-inset-left', '%dpx');" +
                "  document.documentElement.style.setProperty('--safe-area-inset-right', '%dpx');" +
                "} catch(e) {}",
                top, bottom, left, right
            );
            webView.post(() -> webView.evaluateJavascript(script, null));
        }
    }
}
