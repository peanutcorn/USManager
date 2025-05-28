package com.usm.university

import javafx.fxml.FXML
import javafx.fxml.FXMLLoader
import javafx.scene.Parent
import javafx.scene.Scene
import javafx.stage.Stage
import javafx.event.ActionEvent

class StudentMainUIController {
    @FXML
    private fun goToUserInformation(event: ActionEvent) {
        switchScene(event, "/User_informationUI.fxml", "Student Information UI")
    }

    @FXML
    private fun goToScholarshipUI(event: ActionEvent) {
        switchScene(event, "/Student_ScholarshipUI.fxml", "Scholarship UI")
    }

    @FXML
    private fun goToScholarshipInquiry(event: ActionEvent) {
        switchScene(event, "/ConfirmSubjectUI.fxml", "Scholarship Inquiry")
    }

    @FXML
    private fun goToScholarshipApplication(event: ActionEvent) {
        switchScene(event, "/RegisterSubject_UI.fxml", "Scholarship Application Screen")
    }

    private fun switchScene(event: ActionEvent, fxmlPath: String, title: String) {
        val stage = (event.source as javafx.scene.Node).scene.window as Stage
        val loader = FXMLLoader(javaClass.getResource(fxmlPath))
        val root: Parent = loader.load()
        stage.scene = Scene(root)
        stage.title = title
        stage.show()
    }
}