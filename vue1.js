  var config = ({

  	 optionMergeStrategies: Object.create(null),
  })

   var strats = config.optionMergeStrategies;

var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
 ]; 


LIFECYCLE_HOOKS.forEach(function (hook) {
    console.log('mergeHook',mergeHook)
    strats[hook] = mergeHook;
});
//定义new 对象
function Vue(options) {
   this._init(options);
}

initMixin(Vue);

function initMixin(Vue) {
	Vue.prototype._init = function (options) {
	  var vm = this;
      
      console.log("wo",vm,vm.constructor)
	  //合并参数
       vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
        
	  // initLifecycle(vm);
	    
       callHook(vm, 'beforeCreate');

	   initState(vm);     
      //钩子函数
      callHook(vm , "created");
	}
 }


//合并参数
  function mergeOptions (parent,child,vm) {
   
    var options = {};
    var key;

    for (key in child) {
        mergeField(key);
    }


    function mergeField (key) {
     console.log(strats[key])
      var strat = strats[key] || defaultStrat;
 
      options[key] = strat(parent[key], child[key], vm, key);
    }
    

    return options
  }




 var defaultStrat = function (parentVal, childVal) {

    return childVal === undefined
      ? parentVal
      : childVal
  };


 function initLifecycle (vm) {

    var options = vm.$options;
    console.log('initLifecycle',vm)
    // locate first non-abstract parent
    var parent = undefined;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }


  function callHook (vm, hook) {
    console.log(111,vm)
    var handlers = vm.$options[hook];
    var info = hook + " hook";

    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {

        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
  }

  function invokeWithErrorHandling (handler,context,
    args,
    vm,
    info
  ) {
    var res;
    try {
      res = args ? handler.apply(context, args) : handler.call(context);
      if (res && !res._isVue && isPromise(res) && !res._handled) {
        res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
        // issue #9511
        // avoid catch triggering multiple times when nested calls
        res._handled = true;
      }
    } catch (e) {
      // handleError(e, vm, info);
    }
    return res
  }





  function resolveConstructorOptions (Ctor) {
    var options = Ctor;

    if (Ctor.super) {
  
    }
    return options
  }




  function mergeHook (parentVal,childVal) {
    var res = childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal;
    return res
      ? dedupeHooks(res)
      : res
  }

  function dedupeHooks (hooks) {
    var res = [];
    for (var i = 0; i < hooks.length; i++) {
      if (res.indexOf(hooks[i]) === -1) {
        res.push(hooks[i]);
      }
    }
    console.log('res',res)
    return res
  }


function initState (vm) {
    var opts = vm.$options;
    console.log(111,vm.$options)
    if (opts.data) {
      initData(vm);
     }else {
     	alert(11)
      //observe(vm._data = {}, true /* asRootData */);
    }
    //   observe(vm._data = {}, true /* asRootData */);
    // }
  }


  function initData (vm) {
    var data = vm.$options.data;
     data = vm._data = data;
     console.log(1112,vm)
    
    var keys = Object.keys(data);
  
    var i = keys.length;
    while (i--) {

      var key = keys[i];
        proxy(vm, "_data", key);
      
    }
  }


function noop (a, b, c) {}

var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

function proxy (target, sourceKey, key) {
console.log('set',target,sourceKey,key)
    sharedPropertyDefinition.get = function  () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function  (val) {

      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }
