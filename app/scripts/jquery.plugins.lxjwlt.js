;(function($){
	$.fn.extend({
		// 页面滚动至元素顶部
		goTop: function (speed) {
			if ($(this).is(':animated')) return false;
			var targetOffset = $(this).offset().top;
			speed = speed || 400;
			$('html,body').animate({
				scrollTop: targetOffset
			}, speed);
			return this;
		},
		// 创建置顶按钮
		// 需要引用：
		// goTop 方法
		createGoTop: function(options){
			var $me = this,
				$parent = $me.parent();
			var o = $.extend({
				// 参考物，用于限定按钮显现高度，默认为父元素
				reference : $parent,
				// 作用物，指定滚动至该元素的顶部，默认为父元素
				actor : $parent
			},options);
			var $ref = $(o.reference),
				$actor = $(o.actor),
				rTop = $ref.offset().top;
			// 预设样式
			if($me.css('position') !== 'fixed'){
				$me
					.css({
						'display' : 'none',
						'position' : 'fixed',
						'left' : o.left || $ref.offset().left + $ref.outerWidth() + 'px',
						'bottom' : o.bottom || 0 + 'px',
						// 必须除去外边距
						'margin': '0'
					});
			}else{
				// 如果用户给定了left或bottom参数
				if(o.left){
					$me.css('left', o.left);
				}
				if(o.bottom){
					$me.css('left', o.bottom);
				}
			}
			$me.on('click', function(event){
				// 滚动到参考物的顶部
				$actor.goTop();
				event.preventDefault();
			});
			// 当页面滚动时，控制置顶按钮显示隐藏
			$(window).on('scroll', function(){
				// 判断视口顶部是否超过了参考物的顶部
				if($(this).scrollTop() >= rTop){
					$me
						.css('display', 'block')
						.stop()
						.animate({opacity : 1});
				}else{
					$me
						.stop()
						.animate({opacity : 0}, function(){
							$me.css('display', 'none');
						});
				}
			});
		},
		// 生成placeholder
		createPlaceholder: function(){
			//判断浏览器是否支持placeholder属性
			if ( 'placeholder' in document.createElement('input') ) {
				return false;
			}
			return this.each(function(){
				var $me = $(this),
					// 创建label标签
					$placeholder = $('<label>'+$me.attr('placeholder')+'</label>');
				$placeholder
					.css({
						'height':$me.innerHeight()+'px',
						'line-height':$me.innerHeight()+'px',
						'position': 'absolute',
						'left' : $me.position().left,
						'top' : $me.position().top,
						'z-index': '1000',
						'color': '#b8bcc2',
						'cursor':'text'
					})
					.css($me.css([
						'margin-top','margin-left',
						'padding-top','padding-left',
						 'font-size'
					]))
					.attr('for', $me.attr('id'))
					.insertBefore($me);
				// me.$placeholder = $placeholder;
				$me
					// 将对应的placeholder保存下来
					.data('placeholder', $placeholder)
					// 每次按钮起落都检查input中是否为空
					.on('keydown keyup', function(){
						var $this = $(this),
							$placeholder = $this.data('placeholder');
						if(!$this.val()){
							$placeholder.css('visibility','visible');
						}else{
							$placeholder.css('visibility','hidden');
						}
					})
					// 一开始变触发检查
					.triggerHandler('keyup');
			});
		},
		// 为按钮绑定下拉菜单
		bindDropDownList: function(options){
			var o = $.extend({
				// 下来菜单，默认为该元素的同辈ul标签
				DDList : this.siblings('ul'),
				// 设定类名，同类的按钮共用同一个类名，用于标记正在打开的按钮
				class : 'dropDownButton' + new Date().getTime(),
				// 定制回调函数，点击按钮时调用，默认为空
				start : null,
				// 定制回调函数，点击按钮后调用，默认为空
				stop : null
			}, options);
			return this.each(function(index){
				var $me = $(this);
				// 检查该元素是否已经绑定了下拉菜单
				if(!$me.data('DDList')){
					$me.data( 'DDList', $(o.DDList).eq(index) );
					var $DDList = $me.data('DDList');
				}else{
					// 跳过本次循环
					return;
				}
				$me
					.on('click', o.start)
					.on('click', function(){
						var $this = $(this),
							// 捕获对应的下拉菜单
							$targetList = $this.data('DDList');
						// 如果对象仍在动画过程中，点击无效
						if($targetList.is(':animated')) {
							return false;
						}
						if(!$this.hasClass(o.class)){
							// 获取正被激活的按钮
							var $enabledElem = $('.'+o.class);
							if($enabledElem.length){
								$enabledElem.triggerHandler('click');
							}
							$this.addClass(o.class);
							$(document).on('click.' + o.class, function(){
								var $target = $('.' + o.class);
								if($target.length){
									$target.triggerHandler('click');
								}
							});
						}else{
							$this.removeClass(o.class);
							$(document).off('click.' + o.class);
						}
						$targetList.fadeToggle(100, o.stop);
						return false;
					});
				$DDList
					.on('click', function(event){
						//冒泡截止
						event.stopPropagation();
					})
					.on('click', 'a', function(event){
						$('.'+o.class).triggerHandler('click');
					});
			});
		},
		// 元素内容域（除去边框区域）相对页面的位置
		offsetContent : function(){
			var $me = this;
			var left = $me.offset().left + parseFloat($me.css('border-left-width'));
			var top = $me.offset().top + parseFloat($me.css('border-top-width'));
			return {
				left:left,
				top:top
			};
		},
		// 获取元素真正的最近定位的父元素
		realOffsetParent : function(){
			var $me = this,
				enable = ($me.css('display') === 'none') ? true : false,
				$result;
			if(enable){
				// 记录原值
				var display = $me.css('display');
				$me.css('display', 'block');
			}
			$result = $me.offsetParent();
			// 恢复原值
			if(enable){
				$me.css('display', display);
			}
			return $result;
		},
		// 可拖拽化元素
		// 需要引用：
		// offsetContent 方法
		// clearSlct方法
		// realOffsetParent 方法
		draggable: function(options){
			return this.each(function(){
				var $me = $(this),
					// 获取最近定位父元素
					$parent = $me.realOffsetParent();
				// 默认值：
				var o = $.extend({
					// 限制容器，默认为最近定位父级元素
					container : $parent,
					// 拖动触发对象，默认为该元素自身
					dragHandler : $me,
					// 水平锁定，即只能垂直移动，默认关闭
					lockX : false,
					// 垂直锁定，即只能水平移动，默认关闭
					lockY : false,
					// 拖拽开始时执行的函数
					start : null
				}, options);
				//重设css样式
				$me.css({
					'margin' : 0
				});
				if($me.css('position') !== 'absolute'){
					$me.css('position', 'absolute');
				}
				//计算最近定位父元素内容区域相对于window的位置
				var pLeft = $parent.offsetContent().left,
					pTop = $parent.offsetContent().top;
				//计算容器内容区域相对于window的位置
				var cLeft = o.container.offsetContent().left,
					cTop = o.container.offsetContent().top;
				//计算 left 和 top 的最大值
				var minLeft = cLeft - pLeft,
					minTop = cTop - pTop;
				//计算 left 和 top 的最大值
				var maxLeft = o.container.innerWidth() + minLeft - $me.outerWidth(),
					maxTop = o.container.innerHeight() + minTop - $me.outerHeight();
				$me
					.on('move', function(event, targetLeft, targetTop){
						var $this = $(this);
						if(!o.lockX){
							if(targetLeft > maxLeft){
								$this.css('left', maxLeft);
							}else if(targetLeft < minLeft){
								$this.css('left', minLeft);
							}else{
								$this.css('left', targetLeft);
							}
						}
						if(!o.lockY){
							if(targetTop > maxTop){
								$this.css('top', maxTop);
							}else if(targetTop < minTop){
								$this.css('top', minTop);
							}else{
								$this.css('top', targetTop);
							}
						}
					})
					// 拖拽中要执行的函数
					.on('move', o.drag);
				o.dragHandler
					// 拖拽开始时要执行的函数
					.on('mousedown.drag', o.start)
					.on('mousedown.drag', function(event){
						//获取鼠标坐标和元素坐标的差值
						var dLeft = event.pageX - $me.offset().left,
							dTop = event.pageY - $me.offset().top;
						$(document)
							.on('mousemove.drag', {dLeft:dLeft,dTop:dTop}, function(event){
								//计算目标 left 和 top 值
								var targetLeft = event.pageX - pLeft - event.data.dLeft,
									targetTop = event.pageY - pTop - event.data.dTop;
								$me.triggerHandler('move', [targetLeft, targetTop]);
								//每次拖动都清除文字选择
								$.clearSlct();
							})
							// 拖拽结束时需要执行的函数
							.on('mouseup.drag', o.stop)
							.on('mouseup.drag', function(){
								$(this).off('mousemove.drag mouseup.drag');
							})
						//取消鼠标的选择文本状态
						event.preventDefault();
					});
			});
		},
		// 鼠标中键
		mousewheel: function(fn){
			return this.each(function(){
				var $this = $(this),
					me = this;
				function fnc(event){
					event = event || window.event;
					//Firefox
					if('detail' in event){
						event.wheelDelta = -event.detail;
					}
					//ie
					if('cancelBubble' in event){
						event.stopPropagation = function(){
							event.cancelBubble = true;
						};
					}
					if('returnValue' in event){
						event.preventDefault = function(){
							event.returnValue = false;
						};
					}
					fn.call(me, event);
				}
				if(window.addEventListener){
					//Firefox
					this.addEventListener('DOMMouseScroll', fnc, false );
					//chrome
					this.addEventListener('mousewheel', fnc, false );
				}else{
					//ie
					this.attachEvent('onmousewheel', fnc);
				}
			});
		},
		// 创建滚动条
		// 需要引用：
		// draggable 方法
		// mousewheel 方法
		createScroll: function(options){
			// 默认值：
			var o = $.extend({
				// 设置是否总是显现，默认为true，即总是显现，设置为false值会自动隐藏
				alwaysVisible : true,
				// 设置滚动内容域的高度，默认为300px
				height : '300px',
				// 设置滚动条的宽度
				size : '8px',
				// 设置滚动条颜色
				color : '#000',
				// 设置滚动槽颜色
				railColor : '#666',
				// 设置滚动槽是否显示，默认为显示
				railVisible : true,
				// 设置滚动的刻度值
				wheelStep : 10,
				// 容器的类名
				containerClass : 'scroll-container',
				// 滚动条的类名
				barClass : 'scroll-bar',
				// 滚动槽的类名
				railClass : 'scroll-rail'
			}, options);
			return this.each(function(){
				var $me = $(this),
					// 容器高度
					cHeight = parseFloat(o.height),
					// 滚动区域总高度
					mHeight = this.scrollHeight,
					// 滚动刻度
					wheelStep = o.wheelStep,
					// 容器高度与总高度的比值
					ratioCM = cHeight / mHeight,
					// 总高度与容器高度的比值
					ratioMC = mHeight / cHeight;
				// 预设CSS
				$me.css({
					'height' : cHeight + 'px',
					'overflow' : 'hidden'
				})
				// 检测内容域是否符合设定的范围，如果是，跳出‘本次’函数执行
				if(mHeight <= cHeight) return;
				// 防止滚动条遮挡住内容
				if(o.alwaysVisible && $me.css('padding-right') === '0px'){
					$me.css('padding-right', o.size);
				}
				// 创建包含内容域的容器
				var $container = $('<div></div>')
					.addClass(o.containerClass)
					.css({
						'width' : 'auto',
						'height' : cHeight + 'px',
						'position' : 'relative',
						'overflow' : 'hidden'
					});
				// 创建滚动条
				var $bar = $('<div></div>')
					.addClass(o.barClass)
					.css({
						'display' : o.alwaysVisible ? 'block' : 'none',
						'width' : o.size,
						'height' : cHeight * ratioCM + 'px',
						'position' : 'absolute',
						'right' : 0,
						'top' : 0,
						'z-index' : 100,
						'background-color' : o.color,
						'opacity' : 0.4,
						'-webkit-border-radius' : o.size,
						'-moz-border-radius' : o.size,
						'border-radius' : o.size
					});
				// 创建滚动槽
				var $rail = $('<div></div>')
					.addClass(o.railClass)
					.css({
						'display' : (o.railVisible && o.alwaysVisible) ? 'block' : 'none',
						'width' : o.size,
						'height' : cHeight + 'px',
						'position' : 'absolute',
						'right' : 0,
						'top' : 0,
						'z-index' : 99,
						'background-color' : o.railColor,
						'opacity' : 0.4,
						'-webkit-border-radius' : o.size,
						'-moz-border-radius' : o.size,
						'border-radius' : o.size
					});
				// 组合滚动区域组件
				$me.wrap($container);
				var $container = $me.parent()
					.append($bar)
					.append($rail);
				var $bar = $container.find('.scroll-bar'),
					$rail = $container.find('.scroll-rail');
				// 是否需要隐藏滚动条
				if(!o.alwaysVisible){
					// 是否在拖动滚动条
					var	isDrag = false,
						// 是否在容器内
						isIn = false;
					// 如果需要隐藏滚动条
					function showBar(){
						$bar.stop(true, true).fadeIn();
						if(o.railVisible){
							$rail.stop(true, true).fadeIn();
						}
					}
					function hideBar(){
						if(!isDrag && !isIn && !o.alwaysVisible){
							$bar.stop(true, true).delay(1000).fadeOut();
							if(o.railVisible){
								$rail.stop(true, true).delay(1000).fadeOut();
							}
						}
					}
					$container
						.on('mouseenter', function(){
							isIn = true;
							showBar();
						})
						.on('mouseleave', function(){
							isIn = false;
							hideBar();
						});
				}
				// 滚动值
				var scrollVal = 0;
				//可拖动化滚动条
				$bar.draggable({
					// 锁定水平方向移动，只允许垂直方向上移动
					lockX : true,
					start : o.alwaysVisible ? null : function(){
						isDrag = true;
					},
					stop : o.alwaysVisible ? null : function(){
						isDrag = false;
						hideBar();
					},
					drag : function(){
						scrollVal = $(this).position().top * ratioMC;
						// 执行滚动
						$me.scrollTop(scrollVal);
					}
				});
				// 添加内容区域鼠标滚动事件
				$container.mousewheel(function(event){
					var $this = $(this);
					if(event.wheelDelta>0){
						// 当向上滚动时
						scrollVal = Math.max(0, (scrollVal - wheelStep));
					}else{
						// 当向下滚动时
						scrollVal = Math.min(mHeight - cHeight, (scrollVal + wheelStep));
					}
					// 执行滚动
					$me.scrollTop(scrollVal);
					// 相应的移动滚动条
					$bar.css('top', scrollVal * ratioCM + 'px');

					// 取消冒泡和默认行为
					event.stopPropagation();
					event.preventDefault();
				});
			});
		},
		createWindow: function(options){
			var o = $.extend({
				draggable : false
			}, options);
			return this.each(function(){
				var $me = $(this);
				// 获取覆盖层
				var $overlay = $('.window-overlay');
				// 检查覆盖层是否存在
				if($overlay.length){
					$me.appendTo($overlay);
					$overlay.css('display', 'none');
				}else{
					$me.wrap('<div class="window-overlay"></div>')
					$overlay = $me.parent()
						.appendTo('body')
						.css({
							'display':'none',
							'width':'100%',
							'height': '100%',
							'position': 'absolute',
							'left':'0',
							'top':'0',
							'z-index':'1000',
							'background-color':'rgba(0,0,0,.6)'
						});
				}
				// 获取元素宽高
				var width = $me.outerWidth(),
					height = $me.outerHeight();
				// 定义窗体属性
				if(o.draggable){
					var handler = $me.find('.window-handler');
					// 可拖拽化窗体
					$me.draggable({
						// 定义触发拖拽对象
						dragHandler : handler.length ? handler : $me
					});
				}
				$me
					.css({
						'display' : 'none',
						'position' : 'absolute'
					})
					.on('click', function(event){
						// 防止冒泡
						event.stopPropagation();
					})
					// 用于调整窗体的位置
					.on('locate', function(){
						var $this = $(this),
							wHeight = $(window).height(),
							wWidth = $(window).width();
						if(height >= wHeight){
							$this.css('top', '40px');
						}else{
							$this.css('top', $('body').scrollTop() + (wHeight - height)/2 + 'px');
						}
						$this.css('left', $('body').scrollLeft() + (wWidth - width)/2 + 'px');
					})
					// 用于打开窗体
					.on('open', function(){
						$(this).fadeIn();
						$overlay.fadeIn();
						// 注册事件
						// 如果视口大小改变，需要重新调整窗体位置
						$(window)
							.on('resize.window', function(){
								$me.triggerHandler('locate');
							})
							.triggerHandler('resize.window');
						$overlay.on('click.window', function(){
							$me.triggerHandler('close');
							return false;
						});
					})
					// 用于关闭窗体
					.on('close', function(){
						$(this).fadeOut();
						$overlay.fadeOut();
						// 注销事件
						$('window').off('resize.window');
						$overlay.on('click.window');
					})
					.triggerHandler('locate');
				var $closeButton = $me.find('.window-close-button');
				if($closeButton.length){
					$closeButton.on('click', function(){
						$me.triggerHandler('close');
						return false;
					});
				}
			});
		},
		// ‘自定义的按钮’模拟‘文件上传input’功能
		bindFileButton: function(options){
			var o = $.extend({
				fileButton: this.siblings('input:file').eq(0),
				textArea: this.siblings('input:text').eq(0)
			}, options);
			var $me = this,
				$fileButton = o.fileButton,
				$textArea = o.textArea;
			$me.on('click', function(){
				$fileButton.trigger('click');
			});
			$fileButton.on('change', function(){
				$textArea.val($(this).val());
			});
		},
		// 表单验证
		validate: function(options){
			var $me = $(this),

				// 默认参数
				// 将预设参数和用户自定义参数进行‘深层’合并
				defaults = $.extend(true, {
					isEmpty : {
						reg : /^\s*$/,
						expect : true,
						info : 'It should be empty!',
						on : 'change'
					},
					isEmail : {
						reg : /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
						expect : true,
						info : 'It is not a Email address!',
						on : 'change'
					},
					isNum : {
						reg : /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
						expect : true,
						info : 'It is not a number!',
						on : 'change'
					},
					isInt : {
						reg : /^\d+$/,
						expect : true,
						info : 'It is not a integer!',
						on : 'change'
					},
					submit : {
						on : 'click'
					}
				}, $.fn.validate.setup);

			// 合并默认选项defaults和参数options
			var o = (function (defaults, options) {
				var obj = {},
					prop = '';
					
				for (prop in options) {
					obj[prop] = {
						expect : true,
						on : 'change'
					};
					$.extend(obj[prop], defaults[prop], options[prop]);
				}
				return obj;
			})(defaults, options);

			// 处理函数
			// 1.初始化元素的_validation_数据
			// 2.绑定检测事件
			function initValidation(elem, rules){

				// 创建对象，存储筛选后的规则
				var elemRules = $.extend({}, rules);
				delete elemRules.target;
				delete elemRules.on;

				$(elem).each(function(){
					var $this = $(this),
						validation = $this.data('_validation_');

					// 如果该元素存在_validation_数据，则忽略初始化该元素
					if(validation){
						return;
					}

					// 初始化元素的_validation_数据
					$this.data('_validation_', elemRules);
					validation = $this.data('_validation_');

					// 设定id
					validation.id = new Date().getTime();

					// 绑定自定义的事件
					// 不同type类型，绑定不同的事件处理
					if ($this.prop('type') !== 'submit') {

						$this.on(rules.on + '.validate', function(){
							var $this = $(this),
								validation = $this.data('_validation_'),
								formValidation = $me.data('_validation_'),
								match = ( (new RegExp(validation.reg)).test($this.val()) === validation.expect ),
								index = $.indexOf(formValidation.idBox, validation.id);

							// 检查正则表达式的结果是否与期望的值相匹配
							if ( match ) {

								// 在表单的_validation_数据中注销掉该元素的id及其提示文本
								if (index !== -1) {
									formValidation.idBox.splice(index, 1);
									formValidation.infoBox.splice(index, 1);
								}

							} else {
								
								// 在表单的_validation_数据中记录下该元素的id及其提示文本
								if (index === -1) {
									formValidation.idBox.push(validation.id);
									formValidation.infoBox.push(validation.info);
								}

							}

							// 如果存在某些元素不匹配
							if (formValidation.idBox.length){
								formValidation.passed = false;
							} else {
								formValidation.passed = true;
							}

							// callback 回调函数
							// always function
							if ( typeof validation.always === 'function' ) {
								validation.always.call(this, match, formValidation.passed, validation.info);
							}
							if ( match ) {
								// succeed function
								if(typeof validation.succeed === 'function'){
									return validation.succeed.call(this, formValidation.passed);
								}
							}else {
								// fail function
								if (typeof validation.fail === 'function'){
									return validation.fail.call(this, validation.info);
								}
							}
						});

						// 初始化后马上检测
						$this.triggerHandler(rules.on + '.validate');
					} else {
						$this.on(rules.on + '.validate', function(){
							var $this = $(this),
								validation = $this.data('_validation_'),
								formValidation = $me.data('_validation_');

							// callback回调函数	
							// always function
							if(typeof validation.always === 'function'){
								validation.always.call(this, formValidation.passed, formValidation.infoBox);
							}
							// 检查表单是否能通过
							if (formValidation.passed) {
								// succeed function
								if(typeof validation.succeed === 'function'){
									return result = validation.succeed.call(this);
								}
							} else {
								// fail function
								if(typeof validation.fail === 'function'){
									return result = validation.fail.call(this, formValidation.infoBox);
								}
							}
						});
					}
				});

			}


			(function ($me, o) {
				// 初始化表单的_validation_数据
				$me.data('_validation_', {
					passed : true,
					idBox : [],
					infoBox : []
				});

				// 遍历选项 o 中的每组规则，初始化每组中的元素
				var prop ='',
					rules;
				for (prop in o){
					rules = o[prop];
					initValidation(rules.target, rules);
				}
				
			})($me, o);

			// 保持链式操作
			return $me;
		}
	});
	$.extend({
		// 清除文字选取
		clearSlct: "getSelection" in window ? function(){
			window.getSelection().removeAllRanges();
		} : function(){
			document.selection.empty();
		},
		indexOf: function(array, value, fromIndex){
			if (!array instanceof Array){
				return;
			}
			var index;
			fromIndex = fromIndex || 0;
			if (Array.prototype.indexOf){
				index = array.indexOf(value, fromIndex);
			} else {
				for (var i = fromIndex, len = array.length; i < len; i++) {
					if (array[i] === value) { 
						index = i;
						break; 
					}
				}
				if(index === undefined){
					index = -1;
				}
			}
			return index;
		}
	});
})(jQuery);