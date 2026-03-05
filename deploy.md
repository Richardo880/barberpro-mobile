# Deploy - Barbería Imperio APK

## Requisitos previos

- Android SDK instalado (en este proyecto: `/mnt/f/SDK-ANDROID-STUDIO`)
- Java 21 (`/usr/lib/jvm/java-21-openjdk-amd64`)
- Node.js con Expo SDK 54

## 1. Generar la APK

```bash
cd /home/ricardo/barberpro-mobile/android

ANDROID_HOME=/mnt/f/SDK-ANDROID-STUDIO \
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 \
./gradlew assembleRelease
```

La APK se genera en:
```
android/app/build/outputs/apk/release/app-release.apk
```

Copiar con nombre legible:
```bash
cp android/app/build/outputs/apk/release/app-release.apk barberia-imperio.apk
```

## 2. Instalar en emulador

```bash
# Ver dispositivos conectados
/mnt/f/SDK-ANDROID-STUDIO/platform-tools/adb.exe devices

# Si hay una version anterior con firma diferente, desinstalar primero
/mnt/f/SDK-ANDROID-STUDIO/platform-tools/adb.exe uninstall com.barberpro.app

# Instalar
/mnt/f/SDK-ANDROID-STUDIO/platform-tools/adb.exe install barberia-imperio.apk
```

## 3. Instalar en dispositivo fisico

1. Conectar el celular por USB con depuracion USB activada
2. Verificar que aparece con `adb devices`
3. Instalar igual que el emulador:
```bash
/mnt/f/SDK-ANDROID-STUDIO/platform-tools/adb.exe install barberia-imperio.apk
```

Alternativa: copiar el archivo `barberia-imperio.apk` al celular (WhatsApp, Drive, cable USB) y abrirlo directamente.

## 4. Distribuir a usuarios

### Opcion A: Compartir APK directamente
- Subir a Google Drive y compartir el link
- Enviar por WhatsApp/Telegram
- Los usuarios deben habilitar "Instalar apps de fuentes desconocidas"

### Opcion B: Google Play Store (produccion)
1. Crear cuenta de desarrollador en [Google Play Console](https://play.google.com/console) ($25 USD una sola vez)
2. Generar un AAB en vez de APK:
   ```bash
   ANDROID_HOME=/mnt/f/SDK-ANDROID-STUDIO \
   JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 \
   ./gradlew bundleRelease
   ```
   El AAB queda en: `android/app/build/outputs/bundle/release/app-release.aab`
3. Subir el AAB a Play Console y completar la ficha de la app
4. Enviar a revision (tarda 1-7 dias la primera vez)

### Opcion C: EAS (Expo Application Services)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Build en la nube
eas build --platform android --profile production

# Submit a Play Store
eas submit --platform android
```

## Notas

- La APK de release se conecta a: `https://barberia-imperio-py.vercel.app`
- Package name: `com.barberpro.app`
- El backend debe estar corriendo en produccion para que la app funcione
- Si cambias iconos o nombre, recuerda correr `npx expo prebuild --clean` antes de compilar
