//power of closures : an inner function can use variable and functions of the outer functions after it has returned

var budgetController = (function(){
	//some private constans
		var Expense = function(id, des, value){
					this.id = id;
					this.des = des;
					this.value = value;
					this.precentage = -1;
					};
	
		Expense.prototype.calcPrecentage = function(totalIncome){
			if(totalIncome > 0){
				this.precentage = Math.round(this.value/totalIncome * 100);
			}else{
				this.precentage = -1;
			}
		}
		
		Expense.prototype.getPrecentage = function() {
			return this.precentage;
		}
		
		var Income = function(id, des, value){
					this.id = id;
					this.des = des;
					this.value = value;
			
					};
	
		var claculateTotals = function(type) {
			var sum = 0;
			data.allItems[type].forEach(function(cur){
				sum += cur.value;
			});
			
			data.totals[type] = sum;
		}
					
					
		var data = {
			allItems: {
				exp: [],
				inc: [],
			},
			
			totals: {
				exp : 0,
				inc : 0,
			},
			
			budget: 0,
			
			precentage: -1,
				
		};
	

			
	return {
		//public variables functions
		
		
		addNewItem: function(type, des, value){
			var newItem, id;
			//id
			if(data.allItems[type].length > 0){
				id = data.allItems[type][data.allItems[type].length-1].id + 1
			}else{
				id =0;
			}
			if(type === 'inc'){
				newItem = new Income(id, des, value); 	
			}else if(type === 'exp'){
				newItem = new Expense(id, des, value);
			}
			
			data.allItems[type].push(newItem);
			return newItem;
		},
		
		calculateBudget: function(){
			//1.calculate incomes, expenses
			claculateTotals('exp');
			claculateTotals('inc');
			
			//2.calculate budget 
			data.budget = data.totals.inc - data.totals.exp;
			
			//3.calculate total precentage
			if(data.totals.inc > 0){
				data.precentage = Math.round(data.totals.exp / data.totals.inc * 100);	
			}
		},
		
		calculatePrecentages: function(){
			data.allItems.exp.forEach(function(cur){
				cur.calcPrecentage(data.totals.inc);
			});	
		},
		
		getPrecentages: function () {
			var allPrecentages = data.allItems.exp.map(function(cur){
				return cur.getPrecentage()
			});
			
			return allPrecentages;
		},
		
		getBudget(){
			return{
				budget: data.budget,
				income: data.totals.inc,
				expenses: data.totals.exp,
				precentage: data.precentage,
			}
		},
		
		deleteItem(type, id){

			var ids, index;

			ids = data.allItems[type].map(function(current){
					return current.id;
				});
			
			
			index = ids.indexOf(id);	
			
				if(index !== -1){
					data.allItems[type].splice(index, 1);
				}
		
		},
		
		test: function(){
			return data;
		}
	};

	
	
})();


/****** UI CINTROLER ****/
var UIController = (function(){
	//some private constans
	var DomObjects = {
					addButton:'.add__btn',
					type: '.add__type',
					des: '.add__description',
					amount: '.add__value', 
					incomeList: '.income__list',
					expensesList: '.expenses__list',
					budget: '.budget__value',
					income: '.budget__income--value',
					expenses: '.budget__expenses--value',
					precentage: '.budget__expenses--percentage',
					container: '.container',
					precentagesLabel: '.item__percentage',
					date: '.budget__title--month'
				}; 
	var	fromatNum = function(num, type){
				
				var numSplit, int, dec, sign;

					num = Math.abs(num);
					num = num.toFixed(2);
					numSplit = num.split('.');
					int = numSplit[0];
					dec = numSplit[1];

					if(int.length <= 6 && int.length > 3){
						int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3, int.length);
					}else if(int.length > 6){
						int = int.substr(0, int.length - 6) + ',' + int.slice(int.length - 6, int.length-3) + ',' + int.substr(int.length - 3, int.length); 
					}

					type === 'exp' ? sign = '- ' : sign = '+ ';

					 return sign + int + '.' + dec;
				};
		
		var nodeListForEach = function(list, callback){
					for(var i = 0; i < list.length; i++){
							callback(list[i], i);	
					}	
				};
			

	return {
		//public variables && functions	

			getInput: function(){
					return {
						type: document.querySelector(DomObjects.type).value,
						des: document.querySelector(DomObjects.des).value,
						amount: parseFloat(document.querySelector(DomObjects.amount).value),

					}
			},
		
			getDomObject: function () {
				return DomObjects;
			},
		
			addListItem: function(obj, type) {
				var html, newHtml, element;
				
				//1.set a html string
				if(type === 'inc'){
				  element = DomObjects.incomeList;
				  html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'					
				}else if(type === 'exp'){
				   element = DomObjects.expensesList;
				   html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
				}
				
				//2.replace placehordel with data
				newHtml = html.replace('%id%', obj.id);
				newHtml = newHtml.replace('%des%', obj.des);
				newHtml = newHtml.replace('%value%', fromatNum(obj.value, type));
				
				//3.set a new item to UI
				document.querySelector(element).insertAdjacentHTML('beforeEnd', newHtml);
				
			},
			deleteListItem: function(itemId) {
				var element = document.getElementById(itemId); 
				element.parentNode.removeChild(element);
			},
		
			claerFields: function() {
				
				var fields, fieldAsArray;
				
				//fields is an list ... we want to convert it to an array, so that we can loop in it
				fields = document.querySelectorAll(DomObjects.des + ', ' + DomObjects.amount);
				
				//borrow the function from other object by using call function.
				fieldAsArray = Array.prototype.slice.call(fields); 
				
				fieldAsArray.forEach(function (current, index, array) {
						current.value = '';
				});	
				
				fieldAsArray[0].focus();
			},	
		
			displayPrecentage: function(precentages){
				
				var fields;
				fields = document.querySelectorAll(DomObjects.precentagesLabel);
				
				nodeListForEach (fields, function(cur, index){
					if(precentages[index] > 0){
						cur.textContent = precentages[index] + '%';
					}else{
						cur.textContent = '---';						
					}
				});
					
			},
		
			displayBudget: function(budget){
				var type;
				
				 budget.budget >= 0 ? type = 'inc' : type = 'exp';
				
					document.querySelector(DomObjects.budget).textContent = fromatNum(budget.budget, type);	
				
				
				
					document.querySelector(DomObjects.income).textContent = fromatNum(budget.income, 'inc');	
				
				
					document.querySelector(DomObjects.expenses).textContent = fromatNum(budget.expenses, 'exp');	
				
				if(budget.precentage > 0){
					document.querySelector(DomObjects.precentage).textContent = budget.precentage + ' %';	
				}else {
					document.querySelector(DomObjects.precentage).textContent = '---';
				}
			},
		
		displayDate: function(){
			var now, year, months, month;
			months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			now = new Date;
			
			year = now.getFullYear();
			
			month = months[now.getMonth()];
			
			document.querySelector(DomObjects.date).textContent = month + ' ' + year;
			
		},
		
		changeColor: function () {
			var fields = document.querySelectorAll(DomObjects.des + ',' + 
												   DomObjects.amount + ',' +
												  DomObjects.type);
			nodeListForEach(fields, function(cur){
				cur.classList.toggle('red-focus');
			});
			
			document.querySelector(DomObjects.addButton).classList.toggle('red');
		}
	}
})();


/****** MAIN CINTROLER ****/


var controller = (function(budgetC, UIC){
 
	//1. add event listener	
	var setupEventListener = function () {
	
		var doms = UIC.getDomObject();

		document.querySelector(doms.addButton).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(e){
			if(e.keyCode === 13 || e.which === 13){
				ctrlAddItem();
			}
		});
		
		document.querySelector(doms.container).addEventListener('click', ctrlDeleteItem);
		
		document.querySelector(doms.type).addEventListener('change', UIC.changeColor);
		
	}
	
	var updateBudget = function () {
		
		//1.calculate function
		budgetC.calculateBudget();
		
		//2.return the budget 
		
		var budget = budgetC.getBudget()
			
		//3.display budget
		
		UIC.displayBudget(budget);		
	}
	
	var updatePrecentages = function() {
		//1. calculate the budget.
		budgetC.calculatePrecentages();
		//2.read precentagefrom tha budget controller.
		var precentages = budgetC.getPrecentages();
		//3.update the new UI with the new precentage.
		UIC.displayPrecentage(precentages);
		
	}
	
	//2.add new item to data structure
	var ctrlAddItem = function () {
		//1.get inputs from UI
		var input = UIC.getInput();
		if(input.des !== '' && !isNaN(input.amount) && input.amount > 0){
			//2.save new item in data structure
			var newItem = budgetC.addNewItem(input.type, input.des, input.amount);
			//3.put new item in UI
			UIC.addListItem(newItem, input.type);
			//4.clear fields
			UIC.claerFields();
			//5.update budget
			updateBudget();
			//6.update precentges
			updatePrecentages();
		}
	}
	
	
	
	var ctrlDeleteItem = function(e){
		var itemID, splitID, type, id;
		itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;	
		if(itemID){
			splitID = itemID.split('-');
			type = splitID[0];
			id = parseInt(splitID[1]);
			
			//1.delete item from data structures
			budgetC.deleteItem(type, id);
			//2.delete the item from ui
			UIC.deleteListItem(itemID);
			//3.update the budget
			updateBudget();
			//4.update precentages
			updatePrecentages();
		}
	}
	
	return {
		init: function () {
			console.log('Application has started!')
			setupEventListener();
			updateBudget();
			UIC.displayDate();
		}
	}
	
})(budgetController, UIController);

controller.init();