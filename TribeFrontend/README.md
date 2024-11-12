# Instrucciones de configuración inicial

## Requisitos previos

1. **Node.js**: Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Preferentemente una versión LTS.
2. **Java Development Kit (JDK)**: Instala [JDK](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html). Preferentementemente de versión 17 en adelante.
3. **Android Studio**: Descarga e instala [Android Studio](https://developer.android.com/studio).
4. **React Native CLI**: Instala React Native CLI globalmente si aún no lo tienes:
   ```bash
   npm install -g react-native-cli
   ```

## Creación de la aplicación
(No replicar, la aplicación ya está creada)

1. **Crear la aplicación**:
      ```bash
      npx react-native init tribeapp
      ```

## Ejecución de la aplicación
(Luego de hacer un pull del repositorio)

1. **Instalar dependencias**: Ejecuta el siguiente comando en la terminal en la raíz de tu proyecto:
    ```bash
    npm install
    ```

2. **Iniciar la aplicación en Android**:
    ```bash
    npx react-native run-android
    ```

   **Nota**: Puedes agregar la opción `--no-jetifier` si tienes problemas con la compilación.

3. **Iniciar la aplicación en iOS** (solo en macOS):
    ```bash
    npx react-native run-ios
    ```

   **Nota**: Para iOS necesitas tener un Mac con Xcode instalado.

### Posibles inconvenientes

1. **Error [...]A problem occurred configuring project ':react-native-screens'. > [CXX1101] NDK[...]**:
    - Ve a Android Studio > SDK Manager >  Languages & Frameworks > Android SDK > SDK Tools > NDK (Side to Side), seleccionar el ultimo NDK e instalarlo.
    - Copiar el número de versión del NDK recientemente instalado
    - Ir a tribeapp > android > build.gradle y cambiar el valor de la variable buildscript.ext.ndkVersion por la versión recientemente copiada

2. **Metro bundler no se despliega al ejecutar la app**
    - Abrir una terminal paralela y ejecutar el comando:
    ```bash
    npx react-native start
    ```
   
3. **Errores varios realcioandos a dependencias y node_modules**
    - En muchos casos se solucionan borrando node_modules, package-lock.json y/o limpiando el cache.
    ```bash
    npx react-native start --reset-cache
    ```

## Configurar el entorno de ejecución: Crear emulador de Android

### Configuración del entorno

1. Sigue las instrucciones para configurar el entorno de desarrollo en la [documentación oficial de React Native](https://reactnative.dev/docs/set-up-your-environment).

2. Asegurate de tener (o crear) el archivo tribeapp > android > local.propierties. El mismo contrendra el path al SDK de Java. Un ejemplo de como podría verse esto es el siguiente:
    ```bash
    sdk.dir=<ingresar_path_local_hasta_AppData>/AppData/Local/Android/Sdk
    ```

3. Asegurate de tener (o crear) una variable de sistema llamada JAVA_HOME, con un valor que apunte al JDK de Java. ESto puede ser configurado desde System Properties > Environment Variables > System variables > New...: Es aqui donde hay que crear la variable JAVA_HOME, con el valor <path_al_jdk_de_java>. (El JDK de java suele estar en Disco:/Program Files/Java/jdk-<versión_del_jdk>).

### Creación de un emulador Android

1. **Descargar Android SDK**: Descárgalo como parte de Android Studio desde [aquí](https://developer.android.com/studio?hl=es-419).

2. **Abrir el Virtual Device Manager**:
   - En Android Studio, ve a **More Actions > Virtual Device Manager**.
   - Crea un nuevo dispositivo virtual (emulador) seleccionando el dispositivo que prefieras.

3. **Configurar el emulador**: Configura el emulador con las características deseadas (como API Level y RAM), y haz clic en **Finish**. Luego, selecciona el emulador en la lista y haz clic en **Run**.
   - (!) Dispositivo: Elige un dispositivo común como "Pixel 4" o "Pixel 5".
   - (!) API Level: Usa una API Level que sea estable, como 33 o 34 (Android 13 o 14).

### Posibles inconvenientes

1. **Error al instalar Android Emulator hypervisor driver (causado en chipset AMD)**:
   - [Fuente de solución propuesta](https://stackoverflow.com/questions/66932346/facing-android-studio-emulator-error-with-amd-cpu-2021)
   - Una posible solución es habilitar la opción **SVM Mode** desde la BIOS del sistema.

2. **Failure calling service package: Broken pipe (32)**:
   - [Fuente de solución propuesta](https://medium.com/@abigail-edwin/solved-failure-calling-service-package-broken-pipe-32-3b860c7e04bb)
   - La solución es eliminar y reinstalar el emulador desde el **Virtual Device Manager** en Android Studio.

## Estrucutura de subdirectorios de la carpeta App:

```bash
app/
│
├── assets/               # Archivos estáticos como fuentes, imágenes, sonidos, etc.
│   ├── certificates/     # Certificados digitales o de seguridad, si aplica.
│   ├── constants/        # Constantes utilizadas en la aplicación.
│   ├── fonts/            # Fuentes personalizadas utilizadas en la aplicación.
│   ├── images/           # Imágenes estáticas usadas en la app.
│   ├── localization/     # Archivos para localización de idiomas.
│   ├── lottie/           # Animaciones Lottie utilizadas en la aplicación.
│   └── sound/            # Archivos de sonido usados en la app.
│
├── context/              # Contextos que proveeran información requerida globalmente en la aplicación.
│
├── helper/               # Funciones auxiliares o de utilidades que facilitan tareas comunes.
│   └── navigationHandlers/ # Funciones que gestionan la lógica de redirección o flujo de navegación.
│   └── permissionHandlers/ # Archivos de sonido usados en la app.
│ 
├── navigation/           # Configuración del sistema de navegación de la aplicación.
│
├── networking/           # Configuración para la comunicación con servicios externos o API.
│   └── api/              # Definición de las conexiones y requests HTTP. Endpoints y lógica para la interacción con servicios web.
│
├── ui/                   # Componentes visuales reutilizables de la interfaz de usuario.
│   ├── components/       # Componentes individuales de la UI como botones, tarjetas, etc.
│   └── screens/          # Pantallas completas que componen las diferentes vistas de la aplicación.
│
└── App.js                # Punto de entrada principal de la aplicación React Native.
```
 
### Descripción de cada directorio

- **assets/**: Contiene todos los recursos estáticos que no cambian durante el ciclo de vida de la aplicación. Incluye fuentes personalizadas, imágenes, sonidos y certificados necesarios para la app.
   - **certificates/**: Almacena certificados digitales o de seguridad que pueden ser necesarios para la autenticación o encriptación dentro de la aplicación.
   - **constants/**: Contiene valores constantes que se utilizan en toda la aplicación, como claves de API, URLs de servicios, etc.
   - **fonts/**: Incluye todas las fuentes personalizadas que se utilizan en la aplicación para mantener una apariencia consistente.
   - **images/**: Almacena todas las imágenes estáticas que se utilizan en la aplicación, como logotipos, iconos y gráficos.
   - **localization/**: Contiene archivos de localización que permiten que la aplicación soporte múltiples idiomas y regiones.
   - **lottie/**: Almacena animaciones Lottie que se utilizan para mejorar la experiencia del usuario con animaciones atractivas.
   - **sound/**: Incluye archivos de sonido que se utilizan en la aplicación, como efectos de sonido y notificaciones.

- **context/**: Proporciona contextos que permiten compartir información globalmente en la aplicación sin necesidad de pasar props manualmente a través de cada componente.

- **helper/**: Contiene funciones auxiliares o utilidades que facilitan tareas comunes y reutilizables en la aplicación.
   - **navigationHandlers/**: Incluye funciones que gestionan la lógica de redirección o flujo de navegación dentro de la aplicación.
   - **permissionHandlers/**: Contiene funciones que gestionan los permisos necesarios para la aplicación, como acceso a la cámara o ubicación.

- **navigation/**: Configura el sistema de navegación de la aplicación, definiendo las rutas y la estructura de navegación entre las diferentes pantallas.

- **networking/**: Gestiona la comunicación con servicios externos o APIs, incluyendo la configuración de las conexiones y las solicitudes HTTP.
   - **api/**: Define las conexiones y requests HTTP, incluyendo los endpoints y la lógica para la interacción con servicios web.

- **ui/**: Contiene componentes visuales reutilizables de la interfaz de usuario que se utilizan en toda la aplicación.
   - **components/**: Incluye componentes individuales de la UI, como botones, tarjetas, y otros elementos reutilizables.
   - **screens/**: Contiene las pantallas completas que componen las diferentes vistas de la aplicación, cada una representando una sección o funcionalidad específica.

- **App.js**: Es el punto de entrada principal de la aplicación React Native, donde se inicializa la aplicación y se configuran los proveedores globales y la navegación.

# Generación de APK en modo release

## Configura tu proyecto para un build en release

1. **Configura el archivo `android/app/build.gradle`**:
   Asegúrate de que la configuración de signing esté habilitada para el modo release.

2. **Configura el archivo `gradle.properties`**:
   Para mejorar el rendimiento y evitar problemas de memoria durante el proceso de build, agrega estas opciones al archivo `android/gradle.properties`:
   ```gradle
   org.gradle.daemon=true
   org.gradle.parallel=true
   org.gradle.configureondemand=true
   org.gradle.jvmargs=-Xmx2048M -Dfile.encoding=UTF-8
   ```

3. **Genera una clave de firma para la aplicación**:
   Abre un terminal y navega a la carpeta del proyecto. Genera una clave de firma ejecutando el siguiente comando (cambiar `my-key` y `my-alias` por nombres personalizados):
   ```bash
   keytool -genkey -v -keystore my-key.keystore -alias my-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
   Este comando creará un archivo `.keystore`. Guarda este archivo en un lugar seguro y colócalo en la carpeta `android/app`.

4. **Configura la clave de firma en `android/app/build.gradle`**:
   En `android/app/build.gradle`, busca la sección `signingConfigs` y añade tu clave como sigue:
   ```gradle
   android {
       ...
       signingConfigs {
           release {
               storeFile file("my-key.keystore")  // Cambia el nombre por el de tu archivo de clave
               storePassword "tu-store-password"    // Cambia por tu contraseña del store
               keyAlias "my-alias"                  // Cambia por el alias de tu clave
               keyPassword "tu-key-password"        // Cambia por tu contraseña de clave
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled true // O false si quieres desactivar la minificación en release
               proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
           }
       }
   }
   ```

## Construcción del APK en modo release

Es posible compilar el APK ejecutando el siguiente comando desde la raíz del proyecto:
```bash
cd android
./gradlew assembleRelease
```
Este proceso generará el archivo APK en modo release. Una vez terminado, podrás encontrar el APK en:
```bash
android/app/build/outputs/apk/release/app-release.apk
```






















# Default README

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.js` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
