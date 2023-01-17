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
	sendSubmitToCRM(){
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
        console.log("moveStep movement " + movement);
	    
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
        console.log("is Forward Movement " + fowardMov);
        return fowardMov;
    }
}
var validateRules = '{"panel1":"interested","panel2":"880b0676-b480-ed11-81ad-000d3aba3d29_2|880b0676-b480-ed11-81ad-000d3aba3d29_3|880b0676-b480-ed11-81ad-000d3aba3d29_8|880b0676-b480-ed11-81ad-000d3aba3d29_0","panel3":"7f685ebb-7c54-4cff-a1bc-772562d25c38;3f746946-34b4-442c-a677-e232cdd2bc40;e1dfc514-f301-4cb2-855a-4c8fa8331207;790a6bdd-7832-4dd6-8f30-ed8d8772966e;fc0308ab-609e-45c8-9f5e-9eca3511dc39;eae4766c-f91a-4648-afb1-259b97e89cab;ac6a065d-364e-40d6-9a19-d9bf1ed4aa3e","panel4":"31cf7f09-7f55-eb11-a812-0022489b6868;0d700c73-8055-eb11-a812-0022489b6868","panel5":"bacd7a58-1757-eb11-a812-0022489b6868","panel6":"f40aa13a-8f55-eb11-a812-0022489b6868_1|f40aa13a-8f55-eb11-a812-0022489b6868_0","panel7":"prv1_1;prv2_1"}';

MsCrmMkt.MsCrmFormLoader.on('afterFormLoad', function(event) {
    debugger;
    let wizardElement = document.getElementById('wizard');
    let wizard = new Wizard(wizardElement);
    let buttonNext = document.querySelector('.next');
    let buttonPrevious = document.querySelector('.previous');

    wizard.addControls(buttonPrevious, buttonNext);

    var inputTel = document.querySelector("#telephone");
    window.intlTelInput(inputTel, ({
        initialCountry: "it",
    }));

    document.querySelector('#isOpenChoice-1').addEventListener("change", function() {
        onChangeIsOpen();
    });

    document.querySelector('#isOpenChoice-2').addEventListener("change", function() {
        onChangeIsOpen();
    });
	
    var inputs = document.querySelectorAll('input');
    inputs.forEach(function(element) {
	    var type = element.getAttribute("crm-type");
	    if(type == "crmLookup"){
	         element.addEventListener("focusout", function(evt) {
				fieldChange(evt.target);
			});
	    }else{
			element.addEventListener("change", function(evt) {
				fieldChange(evt.target);
			});
	   }
    });
});
function fieldChange(target){
	console.log("changed");
    var elementName = target.getAttribute("name");
	var type = target.getAttribute("crm-type");  //optionset
	var elementValue = target.value;
	var isChecked = false;
	if(type == "optionset"){
        isChecked = target.checked;
	}
	var editedFieldId = target.id;
    console.log("change input: eName= " + elementName + " eValue= " + elementValue);
    setCRMFieldValue(elementName, elementValue,editedFieldId,isChecked);
    checkRequiredFields(); 
}
function onChangeIsOpen() {
    var isOpen = document.querySelector('input[name="f40aa13a-8f55-eb11-a812-0022489b6868_UI"]:checked').value;
    if (isOpen == 1) {
        document.querySelector('#openingDateContainer').style.display = 'none';
        document.querySelector('#signatureContainer').style.display = 'block';
    } else {
        document.querySelector('#signatureContainer').style.display = 'none';
        document.querySelector('#openingDateContainer').style.display = 'block';
    }
}

function checkRequiredFields() {
    var reqRules = JSON.parse(validateRules);
    var currentPanelId = document.querySelector('.movingIn');
	debugger;
    var currentPanelRules = reqRules[currentPanelId.id];
	var operation = "and";
	var reqFields = "";
	if(currentPanelRules.indexOf("|") != -1){
	   operation = "or";
	   reqFields = currentPanelRules.split('|');
	}else{
	   reqFields = currentPanelRules.split(';');
	}
	var valids = [];
	console.log("required ids: "+JSON.stringify(reqFields));
	var noRule = false;
	reqFields.forEach(element => {
	  console.log("checking id: "+element);
	  if (document.getElementById(element) != null) {
	    var type = document.getElementById(element).getAttribute("crm-type");
	    var value = type == "radio" || type == "optionset" ? document.getElementById(element).checked : document.getElementById(element).value;
	    console.log("Type = "+type+" value = "+value);
	    console.log("checking id of type: "+type+" value: "+document.getElementById(element).value+" or checked: "+document.getElementById(element).checked);
        if (value != null && value != "" && value != false) {
	        console.log("pushing id");
	        valids.push(element);
        }
    }else if(currentPanelRules == "x"){
	    let buttonNext = document.querySelector('.next');
        buttonNext.classList.remove('disabled');
        let errorMessage = document.querySelector('#errorMessage');
        errorMessage.style.display = 'none';
	    console.log("returning");
	    noRule = true;
	    return;
	}
	});
	console.log("valids.length = "+valids.length+" operation = "+operation+" reqFields = "+reqFields.length);
	if(((valids.length == reqFields.length && operation == "and") || (valids.length > 0 && operation == "or")) && !noRule){
	    console.log("enabling");
	    let buttonNext = document.querySelector('.next');
        buttonNext.classList.remove('disabled');
        let errorMessage = document.querySelector('#errorMessage');
        errorMessage.style.display = 'none';
	}else if(!noRule){
	    console.log("disablig");
	    let buttonNext = document.querySelector('.next');
        buttonNext.classList.add('disabled');
        let errorMessage = document.querySelector('#errorMessage');
        errorMessage.style.display = 'block';
	}
}

function setCRMFieldValue(name, value,editedFieldId,isChecked) {
    var id = name.replace("_UI", "").replace(`_${value}`,"");
    console.log("updating: "+id+" Val: "+value);
	    var crmType = document.getElementById(editedFieldId).getAttribute("crm-type");
	    console.log("Field with type: "+ crmType+" is changed");
	    if(crmType == "lookup")
			setMacrochannel();
	    else if(crmType == "optionset" && document.getElementById(id+"_"+value))
	         document.getElementById(id+"_"+value).checked = isChecked;
	    else if (document.getElementById(id)) 
			document.getElementById(id).value = value;
	    else if(crmType == "crmLookup")
	        setLookup(id,value);
    
}
function setLookup(e, t) {
    document.getElementById(e).value = t;
    var n = document.createEvent("KeyboardEvent");
    n[void 0 !== n.initKeyboardEvent ? "initKeyboardEvent" : "initKeyEvent"]("keyup", !0, !0, window, !1, !1, !1, !1, 40, 0), document.getElementById(e).focus(), document.getElementById(e).dispatchEvent(n), setTimeout((function() {
        selectOption(e, t)
    }), 1e3)
}

function selectOption(e, t) {
    Array.from(document.getElementById(e).parentNode.getElementsByClassName("ui-menu-item"));
    var n = Array.from(document.getElementById(e).parentNode.getElementsByClassName("ui-menu-item")).filter((function(e) {
        return e.innerText == t
    }));
    console.log(e + " len: " + n.length), 1 == n.length ? (n[0].classList.add("ui-state-active"), document.getElementById(e).setAttribute("data-value", n[0].dataset.value), console.log("setted " + e)) : setTimeout((function() {
        selectOption(e, t)
    }), 1e3)
}

function setMacrochannel() {
    if (document.querySelectorAll('input[name="31cf7f09-7f55-eb11-a812-0022489b6868_UI"]:checked') && document.querySelectorAll('input[name="31cf7f09-7f55-eb11-a812-0022489b6868_UI"]:checked').length == 1) {
        var type = document.querySelectorAll('input[name="31cf7f09-7f55-eb11-a812-0022489b6868_UI"]:checked')[0].value;
        if ("franchising" == type) {
            setLookup("31cf7f09-7f55-eb11-a812-0022489b6868", "ILLYCAFFE\'");
            setLookup("0d700c73-8055-eb11-a812-0022489b6868", "ILLYCAFFE\' - FRANCHISEE");
            //setRequired("numcoffee"))
	        manageRequired("panel5","bacd7a58-1757-eb11-a812-0022489b6868",1);
	        document.getElementById("coffeNumReq").style.display = 'inline';
        } else if ("bar" == type ||
            "pasticceria_gelateria" == type ||
            "ristorante" == type ||
            "hotel" == type ||
            "catering" == type ||
            "ufficio" == type ||
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
	        manageRequired("panel5","bacd7a58-1757-eb11-a812-0022489b6868",1);
	        document.getElementById("coffeNumReq").style.display = 'inline';
        }
        if ("negozio_articoli_casa" == type ||
            "negozio_specializzato" == type) {
            setLookup("31cf7f09-7f55-eb11-a812-0022489b6868", "ELDOM");
            if ("negozio_articoli_casa" == type) {
                setLookup("0d700c73-8055-eb11-a812-0022489b6868", "ELDOM - SPECIALIST HOUSEWARE")
            } else {
                setLookup("0d700c73-8055-eb11-a812-0022489b6868", "ELDOM - DEPARTMENT STORE/ ELECTRONIC STORES (GDS)");
                //removeRequired("numcoffee")) 
            }
	        manageRequired("panel5","bacd7a58-1757-eb11-a812-0022489b6868",0);
	        document.getElementById("coffeNumReq").style.display = 'none';
        }
        if ("negozio_alimentari" == type) {
            setLookup("31cf7f09-7f55-eb11-a812-0022489b6868", "SPEC. RETAIL");
            setLookup("0d700c73-8055-eb11-a812-0022489b6868", "SPEC. RETAIL - GROCERY");
            manageRequired("panel5","bacd7a58-1757-eb11-a812-0022489b6868",0);
	        document.getElementById("coffeNumReq").style.display = 'none';
        }
    }

}
	function manageRequired(panelid,fieldId,operation){
	    debugger;
	    var reqRules = JSON.parse(validateRules);
		var currentPanelRules = reqRules[panelid];
	    var operator = ";"
	    if(currentPanelRules.indexOf("|") != -1)
	        operator = "|";
	    var rulesArray = currentPanelRules.split(operator);
	    if(rulesArray != null){
	        var index = rulesArray.indexOf(fieldId);
	        if(operation == 0){ //remove				
				if(index != -1){
					rulesArray[index] = "x";
				}
	        }else if(index == -1){
	            rulesArray.push(fieldId);
	            var indexX = rulesArray.indexOf("x");
	            if(indexX != -1){
	                rulesArray.splice(indexX,1);
	            }
	        }
	        var newReq = rulesArray.join(operator);
			reqRules[panelid] = newReq;
			validateRules = JSON.stringify(reqRules);
	    }
	}

	function isRequired(panelid,fieldId){
	    var reqRules = JSON.parse(validateRules);
		var currentPanelRules = reqRules[panelid];
	    var operator = ";"
	    if(currentPanelRules.indexOf("|") != -1)
	        operator = "|";
	    var rulesArray = currentPanelRules.split(operator);
	    if(rulesArray != null){
	        var index = rulesArray.indexOf(fieldId);
	        if(index == -1){
	            return false;
	        }else{
	            return  true;
	        }
	    }else{
	       return false;
	    }
	}
