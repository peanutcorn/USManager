plugins {
    java
    id("org.springframework.boot") version "3.5.0"
    id("io.spring.dependency-management") version "1.1.7"
    kotlin("jvm") version "1.9.0"
    kotlin("plugin.spring") version "1.9.0"
    id("org.openjfx.javafxplugin") version "0.1.0"
}

group = "org.usmanager"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.openjfx:javafx-controls:21.0.1")
    implementation("org.openjfx:javafx-fxml:21.0.1")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    runtimeOnly("com.mysql:mysql-connector-j")
    implementation("mysql:mysql-connector-java:8.0.30")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    implementation("org.projectlombok:lombok:1.18.28")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

javafx {
    // will pull in transitive modules
    modules("javafx.controls", "javafx.fxml") // replace with what you modules need

    // another option is to use:
    // modules = listOf("javafx.controls", "javafx.fxml")

    version = "21.0.1" // or whatever version you're using
}

repositories {
    mavenCentral() // I believe jcenter() should work as well
}