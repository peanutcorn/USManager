#!/usr/bin/env kotlin
package com.usm.university

import javafx.application.Application
import javafx.fxml.FXMLLoader
import javafx.scene.Parent
import javafx.scene.Scene
import javafx.stage.Stage
import javafx.scene.control.*
import javafx.event.ActionEvent
import javafx.concurrent.Task
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

class LoginApp : Application() {
    override fun start(primaryStage: Stage) {
        val loader = FXMLLoader(javaClass.getResource("/login.fxml"))
        val root = loader.load<Parent>()
        val scene = Scene(root)

        primaryStage.title = "로그인"
        primaryStage.scene = scene
        primaryStage.show()
        //타이틀

        val usernameField = scene.lookup("#usernameField") as TextField
        val passwordField = scene.lookup("#passwordField") as PasswordField
        val userTypeBox = scene.lookup("#userTypeBox") as ComboBox<String>
        val loginButton = scene.lookup("#loginButton") as Button
        val statusLabel = scene.lookup("#statusLabel") as Label

        loginButton.setOnAction { _: ActionEvent ->
            val username = usernameField.text
            val password = passwordField.text
            val userType = userTypeBox.value
            if (username.isNullOrEmpty() || password.isNullOrEmpty() || userType.isNullOrEmpty()) {
                statusLabel.text = "학번과 비밀번호를 입력해주세요." //입력값 확인
                return@setOnAction
            }
            statusLabel.text = "로그인 중..." //로딩창
            val loginTask = object : Task<String>() {
                override fun call(): String {
                    val url = URL("http://localhost:8080/api/auth/login?username=${URLEncoder.encode(username, "UTF-8")}&password=${URLEncoder.encode(password, "UTF-8")}&userType=${URLEncoder.encode(userType, "UTF-8")}")
                    // 데이터베이스 추가 예정

                    val conn = url.openConnection() as HttpURLConnection
                    conn.requestMethod = "POST"
                    return conn.inputStream.bufferedReader().readText()
                }
            }
            loginTask.setOnSucceeded {
                // 로그인 성공 후 결과 처리
                val result = loginTask.value
                when (result) {
                    "student" -> loadMainUI(primaryStage, "/MainUI_Student.fxml", "Student Main UI") //학생 페이지로 이동
                    "professor" -> loadMainUI(primaryStage, "/MainUI_Processor.fxml", "Professor Main UI") //교수 페이지로 이동
                    "admin" -> loadMainUI(primaryStage, "/MainUI_Admin.fxml", "Admin Main UI") //관리자 페이지로 이동
                    else -> statusLabel.text = "로그인 실패. 비밀번호를 확인해주세요." //로그인 실패시

                }
            }
            loginTask.setOnFailed {
                statusLabel.text = "Login error: ${loginTask.exception.message}" //로그인 에러시
            }
            Thread(loginTask).start()
        }
    }

    private fun loadMainUI(stage: Stage, fxmlPath: String, title: String) {
        val loader = FXMLLoader(javaClass.getResource(fxmlPath))
        val mainRoot = loader.load<Parent>()
        val mainScene = Scene(mainRoot)
        stage.title = title
        stage.scene = mainScene
        stage.show()
    }
}

fun main() {
    Application.launch(LoginApp::class.java)
}