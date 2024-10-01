# Instrucciones de configuración inicial

## Requisitos previos

1. **Node.js**: Asegúrate de tener [Node.js](https://nodejs.org/) instalado. PReferentemente una versión LTS.
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
      npx react-native init TribeFrontend
      ```

## Iniciar la aplicación
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

## Configurar el entorno de ejecución: Crear emulador de Android

### Configuración del entorno

1. Sigue las instrucciones para configurar el entorno de desarrollo en la [documentación oficial de React Native](https://reactnative.dev/docs/set-up-your-environment).

2. Asegurate de tener (o crear) el archivo TribeFrontend > android > local.propierties. El mismo contrendra el path al SDK de Java. Un ejemplo de como podría verse esto es el siguiente:
    ```bash
    sdk.dir=<ingresar_path_local_hasta_AppData>/AppData/Local/Android/Sdk
    ```

### Creación de un emulador Android

1. **Descargar Android SDK**: Descárgalo como parte de Android Studio desde [aquí](https://developer.android.com/studio?hl=es-419).

2. **Abrir el Virtual Device Manager**:
   - En Android Studio, ve a **More Actions > Virtual Device Manager**.
   - Crea un nuevo dispositivo virtual (emulador) seleccionando el dispositivo que prefieras.

3. **Configurar el emulador**: Configura el emulador con las características deseadas (como API Level y RAM), y haz clic en **Finish**. Luego, selecciona el emulador en la lista y haz clic en **Run**.

4. **Iniciar el emulador manualmente**: También puedes iniciar el emulador manualmente en cualquier momento:
    ```bash
    emulator -avd <nombre_del_emulador>
    ```

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
│   ├── fonts/            # Fuentes personalizadas utilizadas en la aplicación.
│   ├── images/           # Imágenes estáticas usadas en la app.
│   ├── localization/     # Archivos para localización de idiomas.
│   └── sound/            # Archivos de sonido usados en la app.
│
├── config/               # Configuración global de la aplicación, como claves API, URL base, etc.
│
├── helper/               # Funciones auxiliares o de utilidades que facilitan tareas comunes.
│
├── hooks/                # Hooks personalizados para gestionar estado o lógica específica.
│
├── models/               # Definición de clases o interfaces para los modelos de datos utilizados.
│
├── navigation/           # Configuración del sistema de navegación de la aplicación.
│   └── api/              # Endpoints y lógica para la interacción con servicios web.
│
├── networking/           # Configuración para la comunicación con servicios externos o API.
│   ├── api/              # Definición de las conexiones y requests HTTP.
│   └── sockets/          # Configuración y manejo de WebSockets o conexiones en tiempo real.
│
├── redux/                # Almacenamiento centralizado y gestión del estado global de la aplicación usando Redux.
│
├── ui/                   # Componentes visuales reutilizables de la interfaz de usuario.
│   ├── components/       # Componentes individuales de la UI como botones, tarjetas, etc.
│   ├── screens/          # Pantallas completas que componen las diferentes vistas de la aplicación.
│   └── styles/           # Estilos personalizados reutilizables para los componentes y pantallas.
│
└── App.js                # Punto de entrada principal de la aplicación React Native.
```

### Descripción de cada directorio

- **assets/**: Contiene todos los recursos estáticos que no cambian durante el ciclo de vida de la aplicación. Incluye fuentes personalizadas, imágenes, sonidos y certificados necesarios para la app.

   - **fonts/**: Fuentes como Poppins u otras que se utilicen en la aplicación.

   - **images/**: Contiene todas las imágenes estáticas.

   - **localization/**: Archivos de traducción para manejar diferentes idiomas.

   - **sound/**: Archivos de audio que podrían utilizarse en alertas o notificaciones dentro de la app.

- **config/**: Aquí se almacenan las configuraciones globales de la app, como variables de entorno, configuración de claves API, y cualquier ajuste que sea utilizado en diferentes partes de la app.

- **helper/**: Funciones auxiliares para resolver problemas recurrentes, como formateo de fechas, validación de datos, etc.

- **hooks/**: Contiene hooks personalizados, que permiten manejar lógica reutilizable, como gestionar formularios, lógica asincrónica, etc.

- **models/**: Define los modelos de datos que representan la estructura de la información en la aplicación, ya sea en formato de clases o interfaces.

- **navigation/**: Aquí se configura el sistema de navegación, como el stack de pantallas, tabs, etc. Además, puede incluir lógica de rutas.

- **networking/**: Gestión de la comunicación con servidores externos. Incluye la definición de endpoints y el manejo de websockets para conexión en tiempo real.

   - **api/**: Se encarga de la interacción con servicios web mediante solicitudes HTTP, como obtener datos o realizar autenticaciones.

   - **sockets/**: Configuración y manejo de la comunicación en tiempo real con WebSockets.

- **redux/**: Contiene todo el código relacionado con el almacenamiento centralizado de la aplicación usando Redux. Aquí se definen las acciones, reducers y el estado global.

- **ui/**: Contiene todo lo relacionado con la interfaz de usuario.

   - **components/**: Componentes reutilizables en toda la app, como botones, inputs, cards, etc.

   - **screens/**: Pantallas completas que representan las vistas principales de la aplicación.

   - **styles/**: Estilos reutilizables que pueden ser aplicados a diferentes componentes o pantallas.

- **App.js**: El archivo principal que inicializa la aplicación. Aquí se suele configurar el `NavigationContainer`, los `Providers` de Redux, o cualquier otra configuración inicial necesaria para la app.


























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

1. Open `App.tsx` in your text editor of choice and edit some lines.
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
