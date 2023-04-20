class Steps {
    constructor(wizard) {
        this.wizard = wizard;
        this.steps = this.getSteps();
        this.stepsQuantity = this.getStepsQuantity();
        this.currentStep = 0;
    }

    setCurrentStep(currentStep) {
        this.currentStep = currentStep;
    }

    getSteps() {
        return this.wizard.getElementsByClassName('step');
    }

    getStepsQuantity() {
        return this.getSteps().length;
    }

    handleConcludeStep() {
        this.steps[this.currentStep].classList.add('-completed');
    }

    handleStepsClasses(movement) {
        if (movement > 0)
            this.steps[this.currentStep - 1].classList.add('-completed');
        else if (movement < 0)
            this.steps[this.currentStep].classList.remove('-completed');
    }
}

class Panels {
    constructor(wizard) {
        this.wizard = wizard;
        this.panelWidth = this.wizard.offsetWidth;
        this.panelsContainer = this.getPanelsContainer();
        this.panels = this.getPanels();
        this.currentStep = 0;

        this.updatePanelsPosition(this.currentStep);
        this.updatePanelsContainerHeight();
    }

    getCurrentPanelHeight() {
        return `${this.getPanels()[this.currentStep].offsetHeight}px`;
    }

    getPanelsContainer() {
        return this.wizard.querySelector('.panels');
    }

    getPanels() {
        return this.wizard.getElementsByClassName('panel');
    }

    updatePanelsContainerHeight() {
        this.panelsContainer.style.height = this.getCurrentPanelHeight();
    }

    updatePanelsPosition(currentStep) {
        const panels = this.panels;
        const panelWidth = this.panelWidth;

        for (let i = 0; i < panels.length; i++) {
            panels[i].classList.remove(
                'movingIn',
                'movingOutBackward',
                'movingOutFoward'
            );

            if (i !== currentStep) {
                if (i < currentStep) panels[i].classList.add('movingOutBackward');
                else if (i > currentStep) panels[i].classList.add('movingOutFoward');
            } else {
                panels[i].classList.add('movingIn');
            }
        }

        this.updatePanelsContainerHeight();
    }

    setCurrentStep(currentStep) {
        this.currentStep = currentStep;
        this.updatePanelsPosition(currentStep);
    }
}

class Wizard {
    constructor(obj) {
        this.wizard = obj;
        this.panels = new Panels(this.wizard);
        this.steps = new Steps(this.wizard);
        this.stepsQuantity = this.steps.getStepsQuantity();
        this.currentStep = this.steps.currentStep;

        this.concludeControlMoveStepMethod = this.steps.handleConcludeStep.bind(this.steps);
        this.wizardConclusionMethod = this.handleWizardConclusion.bind(this);
    }

    updateButtonsStatus() {
        if (this.currentStep === 0)
            this.previousControl.classList.add('disabled');
        else
            this.previousControl.classList.remove('disabled');
    }

    updtadeCurrentStep(movement) {

        this.currentStep += movement;
        this.steps.setCurrentStep(this.currentStep);
        this.panels.setCurrentStep(this.currentStep);

        this.handleNextStepButton();
        this.updateButtonsStatus();

    }

    handleNextStepButton() {

        if (this.currentStep === this.stepsQuantity - 1) {
            //this.nextControl.className = 'fa-regular fa-circle-check';//.innerHTML = 'Conclude!';
            this.nextControl.querySelector('i').classList.replace("fas", "fa-regular");
            this.nextControl.querySelector('i').classList.replace("fa-caret-right", "fa-circle-check");

            this.nextControl.removeEventListener('click', this.nextControlMoveStepMethod);
            this.nextControl.addEventListener('click', this.concludeControlMoveStepMethod);
            this.nextControl.addEventListener('click', this.wizardConclusionMethod);

            this.nextControl.addEventListener('click', this.sendSubmitToCRM);

        } else {
            //this.nextControl.innerHTML = 'Next';
            this.nextControl.querySelector('i').classList.replace("fa-regular", "fas");
            this.nextControl.querySelector('i').classList.replace("fa-circle-check", "fa-caret-right");

            this.nextControl.addEventListener('click', this.nextControlMoveStepMethod);
            this.nextControl.removeEventListener('click', this.concludeControlMoveStepMethod);
            this.nextControl.removeEventListener('click', this.wizardConclusionMethod);

            this.nextControl.removeEventListener('click', this.sendSubmitToCRM);
        }
        this.nextControl.classList.add('disabled');

    }
    sendSubmitToCRM() {
        document.getElementById('congrats-message').style.display = "block";
        document.getElementsByName("submit8ba866e7-0aa3-d0e6-b145-cf1244330fb6")[0].click();
    }

    handleWizardConclusion() {
        if (!this.nextControl.classList.contains('disabled')) {
            this.wizard.classList.add('completed');
        }
    };

    addControls(previousControl, nextControl) {
        this.previousControl = previousControl;
        this.nextControl = nextControl;
        this.previousControlMoveStepMethod = this.moveStep.bind(this, -1);
        this.nextControlMoveStepMethod = this.moveStep.bind(this, 1);

        previousControl.addEventListener('click', this.previousControlMoveStepMethod);
        nextControl.addEventListener('click', this.nextControlMoveStepMethod);

        this.updateButtonsStatus();
    }

    moveStep(movement) {

        if (!this.isForwardMovement(movement) || !this.nextControl.classList.contains('disabled')) {
            if (this.validateMovement(movement)) {
                this.updtadeCurrentStep(movement);
                this.steps.handleStepsClasses(movement);
            } else {
                throw ('This was an invalid movement');
            }
        } else if (this.isForwardMovement(movement) && this.nextControl.classList.contains('disabled')) {
            let errorMessage = document.querySelector('#errorMessage');
            errorMessage.style.display = 'block';
        }
        checkRequiredFields();
    }

    validateMovement(movement) {
        const fowardMov = movement > 0 && this.currentStep < this.stepsQuantity - 1;
        const backMov = movement < 0 && this.currentStep > 0;

        return fowardMov || backMov;
    }
    isForwardMovement(movement) {
        const fowardMov = movement > 0 && this.currentStep < this.stepsQuantity - 1;
        return fowardMov;
    }
}

var validateRules = '{"panel1":"31cf7f09-7f55-eb11-a812-0022489b6868","panel2":"x","panel3":"bacd7a58-1757-eb11-a812-0022489b6868","panel4":"f40aa13a-8f55-eb11-a812-0022489b6868_0","panel5":"7f685ebb-7c54-4cff-a1bc-772562d25c38;3f746946-34b4-442c-a677-e232cdd2bc40;e1dfc514-f301-4cb2-855a-4c8fa8331207;790a6bdd-7832-4dd6-8f30-ed8d8772966e;fc0308ab-609e-45c8-9f5e-9eca3511dc39;eae4766c-f91a-4648-afb1-259b97e89cab;ac6a065d-364e-40d6-9a19-d9bf1ed4aa3e;email;telephone;cap","panel6":"prv1_1;prv2_1"}';
var regexPatterns = String.raw`{"email":"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$","telephone":"^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$","cap":"^\d{5}(?:[-\s]\d{4})?$"}`;
document.addEventListener("DOMContentLoaded", function () {
    var htmlTag = document.getElementsByTagName('html')[0];
    if (htmlTag)
        htmlTag.classList.remove('flexbox');
});

MsCrmMkt.MsCrmFormLoader.on('afterFormLoad', function (event) {
    let wizardElement = document.getElementById('wizard');
    let wizard = new Wizard(wizardElement);
    let buttonNext = document.querySelector('.next');
    let buttonPrevious = document.querySelector('.previous');

    wizard.addControls(buttonPrevious, buttonNext);

    var inputTel = document.querySelector("#telephone");
    window.intlTelInput(inputTel, ({
        initialCountry: "it",
    }));

    document.querySelector('#isOpenChoice-1').addEventListener("change", function () {
        onChangeIsOpen();
    });

    document.querySelector('#isOpenChoice-2').addEventListener("change", function () {
        onChangeIsOpen();
    });

    var inputs = document.querySelectorAll('input');
    inputs.forEach(function (element) {
        var type = element.getAttribute("crm-type");
        if (type == "crmLookup") {
            element.addEventListener("focusout", function (evt) {
                fieldChange(evt.target);
            });
        } else {
            element.addEventListener("change", function (evt) {
                fieldChange(evt.target);
            });
        }
    });
});

function fieldChange(target) {
    var elementName = target.getAttribute("name");
    var type = target.getAttribute("crm-type"); //optionset
    var elementValue = target.value;
    var isChecked = false;
    if (type == "optionset") {
        isChecked = target.checked;
    }
    var editedFieldId = target.id;
    setCRMFieldValue(elementName, elementValue, editedFieldId, isChecked);
    checkFieldValidity(target.getAttribute("id"));
    checkRequiredFields();
}

function onChangeIsOpen() {
    var isOpen = document.querySelector('input[name="f40aa13a-8f55-eb11-a812-0022489b6868_UI"]:checked').value;
    if (isOpen == 1) {
        document.querySelector('#openingDateContainer').style.display = 'none';
        document.querySelector('#signatureContainer').style.display = 'block';

        manageRequired("panel4", "1644edd7-8e55-eb11-a812-0022489b6868", 0);
        document.getElementById("openingDateReq").style.display = 'none';
        manageRequired("panel4", "d4b0bb6e-8e55-eb11-a812-0022489b6868", 1);
        document.getElementById("signatureReq").style.display = 'inline';

        document.getElementById("openingDate").value = null;
        document.getElementById("1644edd7-8e55-eb11-a812-0022489b6868").value = null;


    } else {
        document.querySelector('#signatureContainer').style.display = 'none';
        document.querySelector('#openingDateContainer').style.display = 'block';

        manageRequired("panel4", "1644edd7-8e55-eb11-a812-0022489b6868", 1);
        document.getElementById("openingDateReq").style.display = 'inline';
        manageRequired("panel4", "d4b0bb6e-8e55-eb11-a812-0022489b6868", 0);
        document.getElementById("signatureReq").style.display = 'none';

        document.getElementById("d4b0bb6e-8e55-eb11-a812-0022489b6868_UI").value = null;
        document.getElementById("d4b0bb6e-8e55-eb11-a812-0022489b6868").value = null;
        document.getElementById("competitor").value = null;
        document.getElementById("db98c7ad-8b55-eb11-a812-0022489b6868").value = null;
    }
}

function checkRequiredFields() {
    var reqRules = JSON.parse(validateRules);
    var currentPanelId = document.querySelector('.movingIn');
    var currentPanelRules = reqRules[currentPanelId.id];

    var reqFields = currentPanelRules.split(';');

    var valids = [];
    var noRule = false;
    reqFields.forEach(element => {
        if (document.getElementById(element) != null) {

            var type = document.getElementById(element).getAttribute("crm-type");
            var name = document.getElementById(element).getAttribute("name");
            var isInvalid = document.getElementById(element).classList.contains("is-invalid");
            console.log(`element: ${document.getElementById(element).getAttribute('id') } isInvalid: ${isInvalid}`);
            if (!isInvalid) {
                var value = "";
                if (type == "radio" || type == "optionset") {
                    value = Array.from(document.getElementsByName(name)).find(r => r.checked)?.checked != undefined;
                } else {
                    value = document.getElementById(element).value;
                }

                if (value != null && value != "" && value != false) {
                    valids.push(element);
                }
            }
        } else if (currentPanelRules == "x") {
            let buttonNext = document.querySelector('.next');
            buttonNext.classList.remove('disabled');
            let errorMessage = document.querySelector('#errorMessage');
            errorMessage.style.display = 'none';
            noRule = true;
            return;
        }
    });

    if (valids.length == reqFields.length && !noRule) {

        let buttonNext = document.querySelector('.next');
        buttonNext.classList.remove('disabled');
        let errorMessage = document.querySelector('#errorMessage');
        errorMessage.style.display = 'none';
    } else if (!noRule) {

        let buttonNext = document.querySelector('.next');
        buttonNext.classList.add('disabled');
        let errorMessage = document.querySelector('#errorMessage');
        errorMessage.style.display = 'block';
    }
}

function setCRMFieldValue(name, value, editedFieldId, isChecked) {
    var id = name.replace("_UI", "").replace(`_${value}`, "");

    var crmType = document.getElementById(editedFieldId).getAttribute("crm-type");

    if (crmType == "lookup")
        setMacrochannel();
    else if (crmType == "optionset" && document.getElementById(id + "_" + value))
        document.getElementById(id + "_" + value).checked = isChecked;
    else if (document.getElementById(id))
        document.getElementById(id).value = value;
    else if (crmType == "crmLookup")
        setLookup(id, value);

}

function setLookup(e, t) {
    document.getElementById(e).value = t;
    var n = document.createEvent("KeyboardEvent");
    n[void 0 !== n.initKeyboardEvent ? "initKeyboardEvent" : "initKeyEvent"]("keyup", !0, !0, window, !1, !1, !1, !1, 40, 0), document.getElementById(e).focus(), document.getElementById(e).dispatchEvent(n), setTimeout((function () {
        selectOption(e, t)
    }), 1e3)
}

function selectOption(e, t) {
    Array.from(document.getElementById(e).parentNode.getElementsByClassName("ui-menu-item"));
    var n = Array.from(document.getElementById(e).parentNode.getElementsByClassName("ui-menu-item")).filter((function (e) {
        return e.innerText == t
    }));
    if (1 == n.length) {
        n[0].classList.add("ui-state-active");
        document.getElementById(e).setAttribute("data-value", n[0].dataset.value);
    } else {
        setTimeout((function () {
            selectOption(e, t)
        }), 1e3);
    }
}

function setMacrochannel() {
    if (document.querySelectorAll('input[name="31cf7f09-7f55-eb11-a812-0022489b6868_UI"]:checked') && document.querySelectorAll('input[name="31cf7f09-7f55-eb11-a812-0022489b6868_UI"]:checked').length == 1) {
        var type = document.querySelectorAll('input[name="31cf7f09-7f55-eb11-a812-0022489b6868_UI"]:checked')[0].value;
        if ("franchising" == type) {
            setLookup("31cf7f09-7f55-eb11-a812-0022489b6868", "ILLYCAFFE\'");
            setLookup("0d700c73-8055-eb11-a812-0022489b6868", "ILLYCAFFE\' - FRANCHISEE");
            //setRequired("numcoffee"))
            manageRequired("panel3", "bacd7a58-1757-eb11-a812-0022489b6868", 1);
            document.getElementById("coffeNumReq").style.display = 'inline';
        } else if ("bar" == type ||
            "pasticceria_gelateria" == type ||
            "ristorante" == type ||
            "hotel" == type ||
            "catering" == type ||
            //"ufficio" == type ||
            "altro" == type) {

            setLookup("31cf7f09-7f55-eb11-a812-0022489b6868", "HO.RE.CA.");
            if ("bar" == type ||
                "pasticceria_gelateria" == type) {
                setLookup("0d700c73-8055-eb11-a812-0022489b6868", "HO.RE.CA. - CAFE\'/BAR")
            } else if ("ristorante" == type) {
                setLookup("0d700c73-8055-eb11-a812-0022489b6868", "HO.RE.CA. - RESTAURANTS")
            } else if ("hotel" == type) {
                setLookup("0d700c73-8055-eb11-a812-0022489b6868", "HO.RE.CA. - HOTEL");
            } else {
                setLookup("0d700c73-8055-eb11-a812-0022489b6868", "HO.RE.CA. - OTHER");
                //setRequired("numcoffee")) 
            }
            if ("catering" != type && "altro" != type) {
                manageRequired("panel3", "bacd7a58-1757-eb11-a812-0022489b6868", 1);
                document.getElementById("coffeNumReq").style.display = 'inline';
            } else {
                manageRequired("panel3", "bacd7a58-1757-eb11-a812-0022489b6868", 0);
                document.getElementById("coffeNumReq").style.display = 'none';
            }
        }
        else if ("negozio_articoli_casa" == type ||
            "negozio_specializzato" == type) {
            setLookup("31cf7f09-7f55-eb11-a812-0022489b6868", "ELDOM");
            if ("negozio_articoli_casa" == type) {
                setLookup("0d700c73-8055-eb11-a812-0022489b6868", "ELDOM - SPECIALIST HOUSEWARE")
            } else {
                setLookup("0d700c73-8055-eb11-a812-0022489b6868", "ELDOM - DEPARTMENT STORE/ ELECTRONIC STORES (GDS)");
                //removeRequired("numcoffee")) 
            }
            manageRequired("panel3", "bacd7a58-1757-eb11-a812-0022489b6868", 0);
            document.getElementById("coffeNumReq").style.display = 'none';
        }
        else if ("negozio_alimentari" == type) {
            setLookup("31cf7f09-7f55-eb11-a812-0022489b6868", "SPEC. RETAIL");
            setLookup("0d700c73-8055-eb11-a812-0022489b6868", "SPEC. RETAIL - GROCERY");
            manageRequired("panel3", "bacd7a58-1757-eb11-a812-0022489b6868", 0);
            document.getElementById("coffeNumReq").style.display = 'none';
        }
        else if ("ufficio" == type) {
            setLookup("31cf7f09-7f55-eb11-a812-0022489b6868", "VENDING");
            setLookup("0d700c73-8055-eb11-a812-0022489b6868", null);

            manageRequired("panel3", "bacd7a58-1757-eb11-a812-0022489b6868", 1);
            document.getElementById("coffeNumReq").style.display = 'inline';

            //document.getElementById("openingQuestions").style.display = "none";
            //document.getElementById("employeeQuestion").style.display = "block";

            //remove opening mandatory
            manageRequired("panel4", "f40aa13a-8f55-eb11-a812-0022489b6868_0", 0);
        } else {        
            //document.getElementById("openingQuestions").style.display = "block";
            //document.getElementById("employeeQuestion").style.display = "none";

            //add opening mandatory
            manageRequired("panel4", "f40aa13a-8f55-eb11-a812-0022489b6868_0", 1);
            document.getElementById("coffeNumReq").style.display = 'inline';
        }
    }

}

function manageRequired(panelid, fieldId, operation) {

    var reqRules = JSON.parse(validateRules);
    var currentPanelRules = reqRules[panelid];
    var operator = ";"
    if (currentPanelRules.indexOf("|") != -1)
        operator = "|";
    var rulesArray = currentPanelRules.split(operator);
    if (rulesArray != null) {
        var index = rulesArray.indexOf(fieldId);
        if (operation == 0) { //remove	

            if (index != -1) {
                if (rulesArray.length == 1)
                    rulesArray[index] = "x";
                else
                    rulesArray.splice(index, 1);
            }
        } else if (index == -1) {

            rulesArray.push(fieldId);
            var indexX = rulesArray.indexOf("x");
            if (indexX != -1) {
                rulesArray.splice(indexX, 1);
            }
        }
        var newReq = rulesArray.join(operator);
        reqRules[panelid] = newReq;
        validateRules = JSON.stringify(reqRules);

    }
}

function isRequired(panelid, fieldId) {
    var reqRules = JSON.parse(validateRules);
    var currentPanelRules = reqRules[panelid];
    var operator = ";"
    if (currentPanelRules.indexOf("|") != -1)
        operator = "|";
    var rulesArray = currentPanelRules.split(operator);
    if (rulesArray != null) {
        var index = rulesArray.indexOf(fieldId);
        if (index == -1) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function checkFieldValidity(fieldId) {
    let result = true;
    let escapeRegexPatterns = regexPatterns.replaceAll("\\", "\\\\");
    //console.log("1- "+escapeRegexPatterns);
    let reqPatterns = JSON.parse(escapeRegexPatterns);
    let pattern = reqPatterns[fieldId];
    if (pattern != null && pattern != "") {
        //let escapeRegex = pattern.replaceAll("\\", "\\\\");
        //console.log("2- " + pattern);
        let patternRegex = new RegExp(pattern, "i");
        var element = document.getElementById(fieldId);
        var errorMessageElement = document.getElementById(fieldId+"Feedback");
        var val = element.value;
        result = patternRegex.test(val);
        if (!result && val != "") {
            element.classList.add("form-control");
            element.classList.add("is-invalid");
            element.classList.add("is-invalid-border");
            element.classList.remove("is-valid-border");
            if (errorMessageElement)
                errorMessageElement.style.display = 'block';
        } else {
            element.classList.remove("form-control");
            element.classList.remove("is-invalid");
            element.classList.remove("is-invalid-border");
            element.classList.add("is-valid-border");
            if (errorMessageElement)
                errorMessageElement.style.display = 'none';
        }
    }
    return result;
}
