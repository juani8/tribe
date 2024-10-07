package com.tribefrontend

import android.os.Bundle
import android.view.LayoutInflater
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen
import android.content.res.Configuration
import java.util.Locale

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String = "TribeFrontend"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onCreate(savedInstanceState: Bundle?) {
        // Detect the system language
        val currentLocale: Locale = resources.configuration.locales.get(0)
        val language = currentLocale.language

        // Manually inflate the correct layout based on language
        val inflater = LayoutInflater.from(this)
        when (language) {
            "en" -> setContentView(inflater.inflate(R.layout.launch_screen_en, null)) // Inflate English launch screen
            else -> setContentView(inflater.inflate(R.layout.launch_screen, null))    // Inflate default launch screen
        }

        super.onCreate(savedInstanceState)
    }
}
