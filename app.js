/**
 * OOJavaScript nuggets
 * @author Sho CARTER-DANIEL <s.carter-daniel@outlook.com>
 */

'use strict';

/**
 * An application doesn't need to be this long, however, I'd suggest 
 * that one either migrates over to ES6 using babel (babel link goes here) 
 * or, could use an AMD loader to split the application into modules.
 * ( a more modular approach )
 */

// This is a module
var EventListener = function() {
	var events = {}

	function emit(name) {
		if (typeof events[name] === 'undefined') {
			throw name + " isn't a valid event.";
			return;
		}

		for (var i = 0; i < events[name].length; i++) {
			var scope = events[name][i].scope;
			events[name][i].func.call(scope);
		}
		return;
	}

	function on(name, cb, scope) {
		if (typeof events[name] === 'undefined') {
			events[name] = [];
		}

		events[name].push({ func: cb, scope: scope });
	}

	return {
		emit: emit,
		on: on
	}
}();


/**
 * This is an IIFE
 * Description: On load time, this function is invoked automatically without 
 * having to be called from any other place. You cannot call this function as
 * you would call any other function.
 */
var Util = (function () {

	/**
	 * Notice how an object literal is returned, yet the function is at the bottom.
	 * This is what "hoisting" is..."a function is loaded before anything else, no
	 * matter where the function is placed, it'll always be 'hoisted'. "
	 */
	return {
		createElement: createElement
	}

	function createElement(tagName, content) {
		var tagName = typeof tagName === 'undefined' ? 'div' : tagName; 
		var element = document.createElement(tagName);
		var text = document.createTextNode(content);
		element.appendChild(text); // this could be .innerHTML, but not best, as it leaves application vulnerable to attacks
		
		return element
	}
})(); // notice the () at the end of this. This is what invokes the function itself


/**
 * To create a class in JavaScript ES5, other than the traditional way of doing
 * this with C#, Java or PHP, you'd have to create a function, and it's methods
 * will be created via using "prototypes"; therefore, any other child element 
 * will inherit the methods as well.
 *
 * In the scenario below:
 * 
 * function User (option) {
 * 		this.forename = typeof option.forename === 'undefined' ? '' : option.forename
 * 		this.surname = typeof option.surname === 'undefined' ? '' : option.surname
 *		this.getFullName = function () {
 * 			return this.forename + ' ' + this.surname;
 * 		}
 * }
 *
 * ...though you may be able to place the method in the function itself, it's not 
 * the best way of create a class; reason being, everytime you create a new instance
 * of this class, it'll create a new copy of itself, including the methods etc as 
 * opposed to creating a new instance and inheriting the methods from the "prototype".
 *
 */
function User (option) {
	this.forename = typeof option.forename === 'undefined' ? '' : option.forename
	this.surname = typeof option.surname === 'undefined' ? '' : option.surname
}

User.prototype.getForename = function () {
	return this.forename;
}

User.prototype.getSurname = function () {
	return this.surname;
}

User.prototype.getFullName = function () {
	return this.forename + ' ' + this.surname;
}


/**
 * APP initialized here.
 * 
 * Structure: 
 * 		- element
 * 		- template
 *		- init
 * 		- render
 *		- setEvents
 */
var App = {
	element: document.getElementById('root'),
	template: `
		<div>
			<h1>VanillaJS Application</h1>
			<form name="user" novalidate>
				<div>
					<label for="forename">Forename</label>
					<input autocomplete="off" id="forename" name="forename" type="text" value="John">
				</div>

				<div>
					<label for="surname">Surname</label>
					<input autocomplete="off" id="surname" name="surname" type="text" value="Smith">
				</div>

				<hr />

				<div>
					<button>Add User</button>
				</div>
			</form>
			<ul class="users" id="users-list"></ul>
		</div>
	`, // add the template...

	init: function () {
		this.render();
	},

	render: function () {
		this.element.innerHTML = this.template;
		this.setEvents();
	},

	// set the events on the elements that have been rendered
	setEvents: function () {	
		this.element.querySelector('form').addEventListener('submit', this.onFormSubmission.bind(this))
		EventListener.on('empty', this.onEmptyFields, this);
	},

	// events will be placed here
	onFormSubmission: function ($ev) {
		$ev.preventDefault();
		var form = $ev.target;
		var data = {
			forename: form.elements.namedItem('forename').value,
			surname: form.elements.namedItem('surname').value
		};
		this.appendToUserlist(data);
	},

	onEmptyFields: function () {
		this.element.querySelector('form').elements.namedItem('forename').value = '';
		this.element.querySelector('form').elements.namedItem('surname').value = '';
	},

	// other methods goes in here
	appendToUserlist: function ($data) {
		var UserModel = new User($data);
		var usersList = this.element.querySelector('#users-list');

		var li = Util.createElement('li', UserModel.getFullName());
		usersList.appendChild( li );

		// emit the event to empty the form
		EventListener.emit('empty');
	}
}


App.init()