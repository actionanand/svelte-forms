
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/CustomInput.svelte generated by Svelte v3.46.2 */

    const { console: console_1$1 } = globals;
    const file$2 = "src/CustomInput.svelte";

    function create_fragment$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			add_location(input, file$2, 10, 0, 131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*inputVal*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputVal*/ 1 && input.value !== /*inputVal*/ ctx[0]) {
    				set_input_value(input, /*inputVal*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CustomInput', slots, []);
    	let { inputVal } = $$props;

    	function emptyMyInput() {
    		$$invalidate(0, inputVal = '');
    	}

    	const writable_props = ['inputVal'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<CustomInput> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		inputVal = this.value;
    		$$invalidate(0, inputVal);
    	}

    	$$self.$$set = $$props => {
    		if ('inputVal' in $$props) $$invalidate(0, inputVal = $$props.inputVal);
    	};

    	$$self.$capture_state = () => ({ inputVal, emptyMyInput });

    	$$self.$inject_state = $$props => {
    		if ('inputVal' in $$props) $$invalidate(0, inputVal = $$props.inputVal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*inputVal*/ 1) {
    			console.log(inputVal);
    		}
    	};

    	return [inputVal, emptyMyInput, input_input_handler];
    }

    class CustomInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { inputVal: 0, emptyMyInput: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CustomInput",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*inputVal*/ ctx[0] === undefined && !('inputVal' in props)) {
    			console_1$1.warn("<CustomInput> was created without expected prop 'inputVal'");
    		}
    	}

    	get inputVal() {
    		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputVal(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emptyMyInput() {
    		return this.$$.ctx[1];
    	}

    	set emptyMyInput(value) {
    		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Toggle.svelte generated by Svelte v3.46.2 */

    const file$1 = "src/Toggle.svelte";

    function create_fragment$1(ctx) {
    	let button0;
    	let t0;
    	let button0_disabled_value;
    	let t1;
    	let button1;
    	let t2;
    	let button1_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			t0 = text("option 1");
    			t1 = space();
    			button1 = element("button");
    			t2 = text("option 2");
    			button0.disabled = button0_disabled_value = /*chosenOption*/ ctx[0] === 1;
    			add_location(button0, file$1, 4, 0, 51);
    			button1.disabled = button1_disabled_value = /*chosenOption*/ ctx[0] === 2;
    			add_location(button1, file$1, 8, 0, 149);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			append_dev(button0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*chosenOption*/ 1 && button0_disabled_value !== (button0_disabled_value = /*chosenOption*/ ctx[0] === 1)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*chosenOption*/ 1 && button1_disabled_value !== (button1_disabled_value = /*chosenOption*/ ctx[0] === 2)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toggle', slots, []);
    	let { chosenOption = 1 } = $$props;
    	const writable_props = ['chosenOption'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toggle> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, chosenOption = 1);
    	const click_handler_1 = () => $$invalidate(0, chosenOption = 2);

    	$$self.$$set = $$props => {
    		if ('chosenOption' in $$props) $$invalidate(0, chosenOption = $$props.chosenOption);
    	};

    	$$self.$capture_state = () => ({ chosenOption });

    	$$self.$inject_state = $$props => {
    		if ('chosenOption' in $$props) $$invalidate(0, chosenOption = $$props.chosenOption);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [chosenOption, click_handler, click_handler_1];
    }

    class Toggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { chosenOption: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toggle",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get chosenOption() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chosenOption(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function isValidEmail(val) {
      return val.includes('@');
    }

    /* src/App.svelte generated by Svelte v3.46.2 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let custominput;
    	let updating_inputVal;
    	let t3;
    	let toggle;
    	let updating_chosenOption;
    	let t4;
    	let input0;
    	let t5;
    	let label0;
    	let input1;
    	let t6;
    	let t7;
    	let h20;
    	let t9;
    	let label1;
    	let input2;
    	let t10;
    	let t11;
    	let label2;
    	let input3;
    	let t12;
    	let t13;
    	let label3;
    	let input4;
    	let t14;
    	let t15;
    	let h21;
    	let t17;
    	let label4;
    	let input5;
    	let t18;
    	let t19;
    	let label5;
    	let input6;
    	let t20;
    	let t21;
    	let label6;
    	let input7;
    	let t22;
    	let t23;
    	let h22;
    	let t25;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let t30;
    	let hr;
    	let t31;
    	let input8;
    	let t32;
    	let button0;
    	let t34;
    	let h23;
    	let t36;
    	let form;
    	let input9;
    	let input9_class_value;
    	let t37;
    	let button1;
    	let t38;
    	let button1_disabled_value;
    	let current;
    	let mounted;
    	let dispose;

    	function custominput_inputVal_binding(value) {
    		/*custominput_inputVal_binding*/ ctx[14](value);
    	}

    	let custominput_props = {};

    	if (/*val*/ ctx[9] !== void 0) {
    		custominput_props.inputVal = /*val*/ ctx[9];
    	}

    	custominput = new CustomInput({ props: custominput_props, $$inline: true });
    	binding_callbacks.push(() => bind(custominput, 'inputVal', custominput_inputVal_binding));
    	/*custominput_binding*/ ctx[15](custominput);

    	function toggle_chosenOption_binding(value) {
    		/*toggle_chosenOption_binding*/ ctx[16](value);
    	}

    	let toggle_props = {};

    	if (/*selectedOption*/ ctx[1] !== void 0) {
    		toggle_props.chosenOption = /*selectedOption*/ ctx[1];
    	}

    	toggle = new Toggle({ props: toggle_props, $$inline: true });
    	binding_callbacks.push(() => bind(toggle, 'chosenOption', toggle_chosenOption_binding));

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(/*appName*/ ctx[0]);
    			t1 = text("!");
    			t2 = space();
    			create_component(custominput.$$.fragment);
    			t3 = space();
    			create_component(toggle.$$.fragment);
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			label0 = element("label");
    			input1 = element("input");
    			t6 = text("\n  Agree to term?");
    			t7 = space();
    			h20 = element("h2");
    			h20.textContent = "Favorite color?";
    			t9 = space();
    			label1 = element("label");
    			input2 = element("input");
    			t10 = text("\n  Red");
    			t11 = space();
    			label2 = element("label");
    			input3 = element("input");
    			t12 = text("\n  Green");
    			t13 = space();
    			label3 = element("label");
    			input4 = element("input");
    			t14 = text("\n  White");
    			t15 = space();
    			h21 = element("h2");
    			h21.textContent = "Known Languages?";
    			t17 = space();
    			label4 = element("label");
    			input5 = element("input");
    			t18 = text("\n  Tamil");
    			t19 = space();
    			label5 = element("label");
    			input6 = element("input");
    			t20 = text("\n  English");
    			t21 = space();
    			label6 = element("label");
    			input7 = element("input");
    			t22 = text("\n  Urdu");
    			t23 = space();
    			h22 = element("h2");
    			h22.textContent = "How you know about us?";
    			t25 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "WhatsApp Group";
    			option1 = element("option");
    			option1.textContent = "Newspaper";
    			option2 = element("option");
    			option2.textContent = "Some website / Blog";
    			option3 = element("option");
    			option3.textContent = "My friend";
    			t30 = space();
    			hr = element("hr");
    			t31 = space();
    			input8 = element("input");
    			t32 = space();
    			button0 = element("button");
    			button0.textContent = "Save";
    			t34 = space();
    			h23 = element("h2");
    			h23.textContent = "Form Validation";
    			t36 = space();
    			form = element("form");
    			input9 = element("input");
    			t37 = space();
    			button1 = element("button");
    			t38 = text("Submit");
    			attr_dev(h1, "class", "capitalize-it svelte-f3bt21");
    			add_location(h1, file, 52, 0, 1259);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file, 55, 0, 1408);
    			attr_dev(input1, "type", "checkbox");
    			add_location(input1, file, 57, 2, 1461);
    			add_location(label0, file, 56, 0, 1451);
    			add_location(h20, file, 61, 0, 1536);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "color");
    			input2.__value = "red";
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[20][1].push(input2);
    			add_location(input2, file, 63, 2, 1571);
    			add_location(label1, file, 62, 0, 1561);
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "name", "color");
    			input3.__value = "green";
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[20][1].push(input3);
    			add_location(input3, file, 67, 2, 1666);
    			add_location(label2, file, 66, 0, 1656);
    			attr_dev(input4, "type", "radio");
    			attr_dev(input4, "name", "color");
    			input4.__value = "white";
    			input4.value = input4.__value;
    			/*$$binding_groups*/ ctx[20][1].push(input4);
    			add_location(input4, file, 71, 2, 1765);
    			add_location(label3, file, 70, 0, 1755);
    			add_location(h21, file, 75, 0, 1855);
    			attr_dev(input5, "type", "checkbox");
    			attr_dev(input5, "name", "lang");
    			input5.__value = "tamil";
    			input5.value = input5.__value;
    			/*$$binding_groups*/ ctx[20][0].push(input5);
    			add_location(input5, file, 78, 2, 1892);
    			add_location(label4, file, 77, 0, 1882);
    			attr_dev(input6, "type", "checkbox");
    			attr_dev(input6, "name", "lang");
    			input6.__value = "english";
    			input6.value = input6.__value;
    			/*$$binding_groups*/ ctx[20][0].push(input6);
    			add_location(input6, file, 82, 2, 1991);
    			add_location(label5, file, 81, 0, 1981);
    			attr_dev(input7, "type", "checkbox");
    			attr_dev(input7, "name", "lang");
    			input7.__value = "urdu";
    			input7.value = input7.__value;
    			/*$$binding_groups*/ ctx[20][0].push(input7);
    			add_location(input7, file, 86, 2, 2094);
    			add_location(label6, file, 85, 0, 2084);
    			add_location(h22, file, 90, 0, 2182);
    			option0.__value = "whatsapp";
    			option0.value = option0.__value;
    			add_location(option0, file, 92, 2, 2251);
    			option1.__value = "newspaper";
    			option1.value = option1.__value;
    			add_location(option1, file, 93, 2, 2302);
    			option2.__value = "internet";
    			option2.value = option2.__value;
    			add_location(option2, file, 94, 2, 2349);
    			option3.__value = "frind";
    			option3.value = option3.__value;
    			add_location(option3, file, 95, 2, 2405);
    			if (/*howYouKnow*/ ctx[6] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[26].call(select));
    			add_location(select, file, 91, 0, 2214);
    			add_location(hr, file, 98, 0, 2457);
    			attr_dev(input8, "type", "text");
    			attr_dev(input8, "id", "username");
    			add_location(input8, file, 100, 0, 2494);
    			add_location(button0, file, 101, 0, 2556);
    			add_location(h23, file, 103, 0, 2601);
    			attr_dev(input9, "type", "email");
    			attr_dev(input9, "class", input9_class_value = "" + (null_to_empty(isValidEmail(/*enteredEmail*/ ctx[8]) ? '' : 'invalid') + " svelte-f3bt21"));
    			add_location(input9, file, 106, 2, 2661);
    			attr_dev(button1, "type", "submit");
    			button1.disabled = button1_disabled_value = !/*isFormValid*/ ctx[11];
    			add_location(button1, file, 107, 2, 2766);
    			add_location(form, file, 105, 0, 2627);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			insert_dev(target, t2, anchor);
    			mount_component(custominput, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(toggle, target, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*price*/ ctx[2]);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, label0, anchor);
    			append_dev(label0, input1);
    			input1.checked = /*agreed*/ ctx[3];
    			append_dev(label0, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, label1, anchor);
    			append_dev(label1, input2);
    			input2.checked = input2.__value === /*favColor*/ ctx[4];
    			append_dev(label1, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, label2, anchor);
    			append_dev(label2, input3);
    			input3.checked = input3.__value === /*favColor*/ ctx[4];
    			append_dev(label2, t12);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, label3, anchor);
    			append_dev(label3, input4);
    			input4.checked = input4.__value === /*favColor*/ ctx[4];
    			append_dev(label3, t14);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, label4, anchor);
    			append_dev(label4, input5);
    			input5.checked = ~/*myLang*/ ctx[5].indexOf(input5.__value);
    			append_dev(label4, t18);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, label5, anchor);
    			append_dev(label5, input6);
    			input6.checked = ~/*myLang*/ ctx[5].indexOf(input6.__value);
    			append_dev(label5, t20);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, label6, anchor);
    			append_dev(label6, input7);
    			input7.checked = ~/*myLang*/ ctx[5].indexOf(input7.__value);
    			append_dev(label6, t22);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, select, anchor);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			select_option(select, /*howYouKnow*/ ctx[6]);
    			insert_dev(target, t30, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, input8, anchor);
    			/*input8_binding*/ ctx[27](input8);
    			insert_dev(target, t32, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t34, anchor);
    			insert_dev(target, h23, anchor);
    			insert_dev(target, t36, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, input9);
    			set_input_value(input9, /*enteredEmail*/ ctx[8]);
    			append_dev(form, t37);
    			append_dev(form, button1);
    			append_dev(button1, t38);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[17]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[18]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[19]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[21]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[22]),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[23]),
    					listen_dev(input6, "change", /*input6_change_handler*/ ctx[24]),
    					listen_dev(input7, "change", /*input7_change_handler*/ ctx[25]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[26]),
    					listen_dev(button0, "click", /*saveData*/ ctx[12], false, false, false),
    					listen_dev(input9, "input", /*input9_input_handler*/ ctx[28]),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[13]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*appName*/ 1) set_data_dev(t0, /*appName*/ ctx[0]);
    			const custominput_changes = {};

    			if (!updating_inputVal && dirty & /*val*/ 512) {
    				updating_inputVal = true;
    				custominput_changes.inputVal = /*val*/ ctx[9];
    				add_flush_callback(() => updating_inputVal = false);
    			}

    			custominput.$set(custominput_changes);
    			const toggle_changes = {};

    			if (!updating_chosenOption && dirty & /*selectedOption*/ 2) {
    				updating_chosenOption = true;
    				toggle_changes.chosenOption = /*selectedOption*/ ctx[1];
    				add_flush_callback(() => updating_chosenOption = false);
    			}

    			toggle.$set(toggle_changes);

    			if (dirty & /*price*/ 4 && to_number(input0.value) !== /*price*/ ctx[2]) {
    				set_input_value(input0, /*price*/ ctx[2]);
    			}

    			if (dirty & /*agreed*/ 8) {
    				input1.checked = /*agreed*/ ctx[3];
    			}

    			if (dirty & /*favColor*/ 16) {
    				input2.checked = input2.__value === /*favColor*/ ctx[4];
    			}

    			if (dirty & /*favColor*/ 16) {
    				input3.checked = input3.__value === /*favColor*/ ctx[4];
    			}

    			if (dirty & /*favColor*/ 16) {
    				input4.checked = input4.__value === /*favColor*/ ctx[4];
    			}

    			if (dirty & /*myLang*/ 32) {
    				input5.checked = ~/*myLang*/ ctx[5].indexOf(input5.__value);
    			}

    			if (dirty & /*myLang*/ 32) {
    				input6.checked = ~/*myLang*/ ctx[5].indexOf(input6.__value);
    			}

    			if (dirty & /*myLang*/ 32) {
    				input7.checked = ~/*myLang*/ ctx[5].indexOf(input7.__value);
    			}

    			if (dirty & /*howYouKnow*/ 64) {
    				select_option(select, /*howYouKnow*/ ctx[6]);
    			}

    			if (!current || dirty & /*enteredEmail*/ 256 && input9_class_value !== (input9_class_value = "" + (null_to_empty(isValidEmail(/*enteredEmail*/ ctx[8]) ? '' : 'invalid') + " svelte-f3bt21"))) {
    				attr_dev(input9, "class", input9_class_value);
    			}

    			if (dirty & /*enteredEmail*/ 256 && input9.value !== /*enteredEmail*/ ctx[8]) {
    				set_input_value(input9, /*enteredEmail*/ ctx[8]);
    			}

    			if (!current || dirty & /*isFormValid*/ 2048 && button1_disabled_value !== (button1_disabled_value = !/*isFormValid*/ ctx[11])) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custominput.$$.fragment, local);
    			transition_in(toggle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custominput.$$.fragment, local);
    			transition_out(toggle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			/*custominput_binding*/ ctx[15](null);
    			destroy_component(custominput, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(toggle, detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(label1);
    			/*$$binding_groups*/ ctx[20][1].splice(/*$$binding_groups*/ ctx[20][1].indexOf(input2), 1);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(label2);
    			/*$$binding_groups*/ ctx[20][1].splice(/*$$binding_groups*/ ctx[20][1].indexOf(input3), 1);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(label3);
    			/*$$binding_groups*/ ctx[20][1].splice(/*$$binding_groups*/ ctx[20][1].indexOf(input4), 1);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(label4);
    			/*$$binding_groups*/ ctx[20][0].splice(/*$$binding_groups*/ ctx[20][0].indexOf(input5), 1);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(label5);
    			/*$$binding_groups*/ ctx[20][0].splice(/*$$binding_groups*/ ctx[20][0].indexOf(input6), 1);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(label6);
    			/*$$binding_groups*/ ctx[20][0].splice(/*$$binding_groups*/ ctx[20][0].indexOf(input7), 1);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t25);
    			if (detaching) detach_dev(select);
    			if (detaching) detach_dev(t30);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(input8);
    			/*input8_binding*/ ctx[27](null);
    			if (detaching) detach_dev(t32);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t34);
    			if (detaching) detach_dev(h23);
    			if (detaching) detach_dev(t36);
    			if (detaching) detach_dev(form);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { appName } = $$props;
    	let val = 'If u click "save", input will be cleared!';
    	let selectedOption = 2;
    	let price = 0;
    	let agreed;
    	let favColor = 'green';
    	let myLang = ['tamil'];
    	let howYouKnow = 'internet';
    	let userNameInput;
    	let elemetRf;
    	let enteredEmail = '';
    	let isFormValid = false;

    	function saveData() {
    		// const inputVal = document.getElementById('username').value;
    		// console.log(inputVal);
    		console.log(userNameInput.value);

    		// calling exported functiom to clear input in customInput comp.
    		elemetRf.emptyMyInput(); // elementRf is the local ref
    	}

    	const writable_props = ['appName'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[], []];

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function custominput_inputVal_binding(value) {
    		val = value;
    		$$invalidate(9, val);
    	}

    	function custominput_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			elemetRf = $$value;
    			$$invalidate(7, elemetRf);
    		});
    	}

    	function toggle_chosenOption_binding(value) {
    		selectedOption = value;
    		$$invalidate(1, selectedOption);
    	}

    	function input0_input_handler() {
    		price = to_number(this.value);
    		$$invalidate(2, price);
    	}

    	function input1_change_handler() {
    		agreed = this.checked;
    		$$invalidate(3, agreed);
    	}

    	function input2_change_handler() {
    		favColor = this.__value;
    		$$invalidate(4, favColor);
    	}

    	function input3_change_handler() {
    		favColor = this.__value;
    		$$invalidate(4, favColor);
    	}

    	function input4_change_handler() {
    		favColor = this.__value;
    		$$invalidate(4, favColor);
    	}

    	function input5_change_handler() {
    		myLang = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(5, myLang);
    	}

    	function input6_change_handler() {
    		myLang = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(5, myLang);
    	}

    	function input7_change_handler() {
    		myLang = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(5, myLang);
    	}

    	function select_change_handler() {
    		howYouKnow = select_value(this);
    		$$invalidate(6, howYouKnow);
    	}

    	function input8_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			userNameInput = $$value;
    			$$invalidate(10, userNameInput);
    		});
    	}

    	function input9_input_handler() {
    		enteredEmail = this.value;
    		$$invalidate(8, enteredEmail);
    	}

    	$$self.$$set = $$props => {
    		if ('appName' in $$props) $$invalidate(0, appName = $$props.appName);
    	};

    	$$self.$capture_state = () => ({
    		CustomInput,
    		Toggle,
    		isValidEmail,
    		appName,
    		val,
    		selectedOption,
    		price,
    		agreed,
    		favColor,
    		myLang,
    		howYouKnow,
    		userNameInput,
    		elemetRf,
    		enteredEmail,
    		isFormValid,
    		saveData
    	});

    	$$self.$inject_state = $$props => {
    		if ('appName' in $$props) $$invalidate(0, appName = $$props.appName);
    		if ('val' in $$props) $$invalidate(9, val = $$props.val);
    		if ('selectedOption' in $$props) $$invalidate(1, selectedOption = $$props.selectedOption);
    		if ('price' in $$props) $$invalidate(2, price = $$props.price);
    		if ('agreed' in $$props) $$invalidate(3, agreed = $$props.agreed);
    		if ('favColor' in $$props) $$invalidate(4, favColor = $$props.favColor);
    		if ('myLang' in $$props) $$invalidate(5, myLang = $$props.myLang);
    		if ('howYouKnow' in $$props) $$invalidate(6, howYouKnow = $$props.howYouKnow);
    		if ('userNameInput' in $$props) $$invalidate(10, userNameInput = $$props.userNameInput);
    		if ('elemetRf' in $$props) $$invalidate(7, elemetRf = $$props.elemetRf);
    		if ('enteredEmail' in $$props) $$invalidate(8, enteredEmail = $$props.enteredEmail);
    		if ('isFormValid' in $$props) $$invalidate(11, isFormValid = $$props.isFormValid);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedOption*/ 2) {
    			console.log(selectedOption);
    		}

    		if ($$self.$$.dirty & /*price*/ 4) {
    			console.log('Price :', price);
    		}

    		if ($$self.$$.dirty & /*agreed*/ 8) {
    			console.log('Agree? ', agreed);
    		}

    		if ($$self.$$.dirty & /*favColor*/ 16) {
    			console.log('Fav. color :', favColor);
    		}

    		if ($$self.$$.dirty & /*myLang*/ 32) {
    			console.log('Known Languages :', myLang);
    		}

    		if ($$self.$$.dirty & /*howYouKnow*/ 64) {
    			console.log('How I know you? ', howYouKnow);
    		}

    		if ($$self.$$.dirty & /*elemetRf*/ 128) {
    			console.log(elemetRf);
    		}

    		if ($$self.$$.dirty & /*enteredEmail*/ 256) {
    			if (isValidEmail(enteredEmail)) {
    				$$invalidate(11, isFormValid = true);
    			} else {
    				$$invalidate(11, isFormValid = false);
    			}
    		}
    	};

    	return [
    		appName,
    		selectedOption,
    		price,
    		agreed,
    		favColor,
    		myLang,
    		howYouKnow,
    		elemetRf,
    		enteredEmail,
    		val,
    		userNameInput,
    		isFormValid,
    		saveData,
    		submit_handler,
    		custominput_inputVal_binding,
    		custominput_binding,
    		toggle_chosenOption_binding,
    		input0_input_handler,
    		input1_change_handler,
    		input2_change_handler,
    		$$binding_groups,
    		input3_change_handler,
    		input4_change_handler,
    		input5_change_handler,
    		input6_change_handler,
    		input7_change_handler,
    		select_change_handler,
    		input8_binding,
    		input9_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { appName: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*appName*/ ctx[0] === undefined && !('appName' in props)) {
    			console_1.warn("<App> was created without expected prop 'appName'");
    		}
    	}

    	get appName() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set appName(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	// target: document.body,
      target: document.getElementById('app'),
    	props: {
    		appName: 'svelte form'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
