!(function (s) {
    "function" == typeof define && define.amd
        ? define(["jquery"], s)
        : "object" == typeof module && module.exports
        ? (module.exports = function (e, t) {
              return void 0 === t && (t = "undefined" != typeof window ? require("jquery") : require("jquery")(e)), s(t), t;
          })
        : s(jQuery);
})(function (d) {
    "use strict";
    function s(e, t) {
        var s = this;
        (s.element = e),
            (s.$element = d(e)),
            (s.state = { multiple: !!s.$element.attr("multiple"), enabled: !1, opened: !1, currValue: -1, selectedIdx: -1, highlightedIdx: -1 }),
            (s.eventTriggers = { open: s.open, close: s.close, destroy: s.destroy, refresh: s.refresh, init: s.init }),
            s.init(t);
    }
    var t = d(document),
        n = d(window),
        l = "selectric",
        i = ".sl",
        a = ["a", "e", "i", "o", "u", "n", "c", "y"],
        r = [/[\xE0-\xE5]/g, /[\xE8-\xEB]/g, /[\xEC-\xEF]/g, /[\xF2-\xF6]/g, /[\xF9-\xFC]/g, /[\xF1]/g, /[\xE7]/g, /[\xFD-\xFF]/g];
    (s.prototype = {
        utils: {
            isMobile: function () {
                return /android|ip(hone|od|ad)/i.test(navigator.userAgent);
            },
            escapeRegExp: function (e) {
                return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            },
            replaceDiacritics: function (e) {
                for (var t = r.length; t--; ) e = e.toLowerCase().replace(r[t], a[t]);
                return e;
            },
            format: function (e) {
                var i = arguments;
                return ("" + e).replace(/\{(?:(\d+)|(\w+))\}/g, function (e, t, s) {
                    return s && i[1] ? i[1][s] : i[t];
                });
            },
            nextEnabledItem: function (e, t) {
                for (; e[(t = (t + 1) % e.length)].disabled; );
                return t;
            },
            previousEnabledItem: function (e, t) {
                for (; e[(t = (0 < t ? t : e.length) - 1)].disabled; );
                return t;
            },
            toDash: function (e) {
                return e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
            },
            triggerCallback: function (e, t) {
                var s = t.element,
                    t = t.options["on" + e],
                    i = [s].concat([].slice.call(arguments).slice(1));
                d.isFunction(t) && t.apply(s, i), d(s).trigger(l + "-" + this.toDash(e), i);
            },
            arrayToClassname: function (e) {
                e = d.grep(e, function (e) {
                    return !!e;
                });
                return d.trim(e.join(" "));
            },
        },
        init: function (e) {
            var t,
                s,
                i,
                n,
                a,
                r,
                o = this;
            (o.options = d.extend(!0, {}, d.fn[l].defaults, o.options, e)),
                o.utils.triggerCallback("BeforeInit", o),
                o.destroy(!0),
                o.options.disableOnMobile && o.utils.isMobile()
                    ? (o.disableOnMobile = !0)
                    : ((o.classes = o.getClassNames()),
                      (e = d("<input/>", { class: o.classes.input, readonly: o.utils.isMobile() })),
                      (t = d("<div/>", { class: o.classes.items, tabindex: -1 })),
                      (s = d("<div/>", { class: o.classes.scroll })),
                      (i = d("<div/>", { class: o.classes.prefix, html: o.options.arrowButtonMarkup })),
                      (n = d("<span/>", { class: "label" })),
                      (a = o.$element.wrap("<div/>").parent().append(i.prepend(n), t, e)),
                      (r = d("<div/>", { class: o.classes.hideselect })),
                      (o.elements = { input: e, items: t, itemsScroll: s, wrapper: i, label: n, outerWrapper: a }),
                      o.options.nativeOnMobile &&
                          o.utils.isMobile() &&
                          ((o.elements.input = void 0),
                          r.addClass(o.classes.prefix + "-is-native"),
                          o.$element.on("change", function () {
                              o.refresh();
                          })),
                      o.$element.on(o.eventTriggers).wrap(r),
                      (o.originalTabindex = o.$element.prop("tabindex")),
                      o.$element.prop("tabindex", -1),
                      o.populate(),
                      o.activate(),
                      o.utils.triggerCallback("Init", o));
        },
        activate: function () {
            var e = this,
                t = e.elements.items.closest(":visible").children(":hidden").addClass(e.classes.tempshow),
                s = e.$element.width();
            t.removeClass(e.classes.tempshow),
                e.utils.triggerCallback("BeforeActivate", e),
                e.elements.outerWrapper.prop("class", e.utils.arrayToClassname([e.classes.wrapper, e.$element.prop("class").replace(/\S+/g, e.classes.prefix + "-$&"), e.options.responsive ? e.classes.responsive : ""])),
                e.options.inheritOriginalWidth && 0 < s && e.elements.outerWrapper.width(s),
                e.unbindEvents(),
                e.$element.prop("disabled")
                    ? (e.elements.outerWrapper.addClass(e.classes.disabled), e.elements.input && e.elements.input.prop("disabled", !0))
                    : ((e.state.enabled = !0), e.elements.outerWrapper.removeClass(e.classes.disabled), (e.$li = e.elements.items.removeAttr("style").find("li")), e.bindEvents()),
                e.utils.triggerCallback("Activate", e);
        },
        getClassNames: function () {
            var i = this,
                n = i.options.customClass,
                a = {};
            return (
                d.each("Input Items Open Disabled TempShow HideSelect Wrapper Focus Hover Responsive Above Below Scroll Group GroupLabel".split(" "), function (e, t) {
                    var s = n.prefix + t;
                    a[t.toLowerCase()] = n.camelCase ? s : i.utils.toDash(s);
                }),
                (a.prefix = n.prefix),
                a
            );
        },
        setLabel: function () {
            var t,
                e,
                s = this,
                i = s.options.labelBuilder;
            s.state.multiple
                ? ((e = 0 === (e = d.isArray(s.state.currValue) ? s.state.currValue : [s.state.currValue]).length ? [0] : e),
                  (t = d.map(e, function (t) {
                      return d.grep(s.lookupItems, function (e) {
                          return e.index === t;
                      })[0];
                  })),
                  (t = d.grep(t, function (e) {
                      return 1 < t.length || 0 === t.length ? "" !== d.trim(e.value) : e;
                  })),
                  (t = d.map(t, function (e) {
                      return d.isFunction(i) ? i(e) : s.utils.format(i, e);
                  })),
                  s.options.multiple.maxLabelEntries &&
                      (t.length >= s.options.multiple.maxLabelEntries + 1 ? (t = t.slice(0, s.options.multiple.maxLabelEntries)).push(d.isFunction(i) ? i({ text: "..." }) : s.utils.format(i, { text: "..." })) : t.slice(t.length - 1)),
                  s.elements.label.html(t.join(s.options.multiple.separator)))
                : ((e = s.lookupItems[s.state.currValue]), s.elements.label.html(d.isFunction(i) ? i(e) : s.utils.format(i, e)));
        },
        populate: function () {
            var i = this,
                e = i.$element.children(),
                t = i.$element.find("option"),
                s = t.filter(":selected"),
                n = t.index(s),
                a = 0,
                t = i.state.multiple ? [] : 0;
            1 < s.length &&
                i.state.multiple &&
                ((n = []),
                s.each(function () {
                    n.push(d(this).index());
                })),
                (i.state.currValue = ~n ? n : t),
                (i.state.selectedIdx = i.state.currValue),
                (i.state.highlightedIdx = i.state.currValue),
                (i.items = []),
                (i.lookupItems = []),
                e.length &&
                    (e.each(function (e) {
                        var s,
                            t = d(this);
                        t.is("optgroup")
                            ? ((s = { element: t, label: t.prop("label"), groupDisabled: t.prop("disabled"), items: [] }),
                              t.children().each(function (e) {
                                  var t = d(this);
                                  (s.items[e] = i.getItemData(a, t, s.groupDisabled || t.prop("disabled"))), (i.lookupItems[a] = s.items[e]), a++;
                              }),
                              (i.items[e] = s))
                            : ((i.items[e] = i.getItemData(a, t, t.prop("disabled"))), (i.lookupItems[a] = i.items[e]), a++);
                    }),
                    i.setLabel(),
                    i.elements.items.append(i.elements.itemsScroll.html(i.getItemsMarkup(i.items))));
        },
        getItemData: function (e, t, s) {
            return { index: e, element: t, value: t.val(), className: t.prop("class"), text: t.html(), slug: d.trim(this.utils.replaceDiacritics(t.html())), alt: t.attr("data-alt"), selected: t.prop("selected"), disabled: s };
        },
        getItemsMarkup: function (e) {
            var s = this,
                i = "<ul>";
            return (
                d.isFunction(s.options.listBuilder) && s.options.listBuilder && (e = s.options.listBuilder(e)),
                d.each(e, function (e, t) {
                    void 0 !== t.label
                        ? ((i += s.utils.format(
                              '<ul class="{1}"><li class="{2}">{3}</li>',
                              s.utils.arrayToClassname([s.classes.group, t.groupDisabled ? "disabled" : "", t.element.prop("class")]),
                              s.classes.grouplabel,
                              t.element.prop("label")
                          )),
                          d.each(t.items, function (e, t) {
                              i += s.getItemMarkup(t.index, t);
                          }),
                          (i += "</ul>"))
                        : (i += s.getItemMarkup(t.index, t));
                }),
                i + "</ul>"
            );
        },
        getItemMarkup: function (e, t) {
            var s = this,
                i = s.options.optionsItemBuilder,
                n = { value: t.value, text: t.text, slug: t.slug, index: t.index };
            return s.utils.format(
                '<li data-index="{1}" class="{2}">{3}</li>',
                e,
                s.utils.arrayToClassname([t.className, e === s.items.length - 1 ? "last" : "", t.disabled ? "disabled" : "", t.selected ? "selected" : ""]),
                d.isFunction(i) ? s.utils.format(i(t, this.$element, e), t) : s.utils.format(i, n)
            );
        },
        unbindEvents: function () {
            this.elements.wrapper.add(this.$element).add(this.elements.outerWrapper).add(this.elements.input).off(i);
        },
        bindEvents: function () {
            var a = this;
            a.elements.outerWrapper.on("mouseenter.sl mouseleave" + i, function (e) {
                d(this).toggleClass(a.classes.hover, "mouseenter" === e.type),
                    a.options.openOnHover && (clearTimeout(a.closeTimer), "mouseleave" === e.type ? (a.closeTimer = setTimeout(d.proxy(a.close, a), a.options.hoverIntentTimeout)) : a.open());
            }),
                a.elements.wrapper.on("click" + i, function (e) {
                    a.state.opened ? a.close() : a.open(e);
                }),
                (a.options.nativeOnMobile && a.utils.isMobile()) ||
                    (a.$element.on("focus" + i, function () {
                        a.elements.input.focus();
                    }),
                    a.elements.input
                        .prop({ tabindex: a.originalTabindex, disabled: !1 })
                        .on("keydown" + i, d.proxy(a.handleKeys, a))
                        .on("focusin" + i, function (e) {
                            a.elements.outerWrapper.addClass(a.classes.focus),
                                a.elements.input.one("blur", function () {
                                    a.elements.input.blur();
                                }),
                                a.options.openOnFocus && !a.state.opened && a.open(e);
                        })
                        .on("focusout" + i, function () {
                            a.elements.outerWrapper.removeClass(a.classes.focus);
                        })
                        .on("input propertychange", function () {
                            var e = a.elements.input.val(),
                                n = new RegExp("^" + a.utils.escapeRegExp(e), "i");
                            clearTimeout(a.resetStr),
                                (a.resetStr = setTimeout(function () {
                                    a.elements.input.val("");
                                }, a.options.keySearchTimeout)),
                                e.length &&
                                    d.each(a.items, function (e, t) {
                                        if (!t.disabled)
                                            if (n.test(t.text) || n.test(t.slug)) a.highlight(e);
                                            else if (t.alt) for (var s = t.alt.split("|"), i = 0; i < s.length && s[i]; i++) if (n.test(s[i].trim())) return void a.highlight(e);
                                    });
                        })),
                a.$li.on({
                    mousedown: function (e) {
                        e.preventDefault(), e.stopPropagation();
                    },
                    click: function () {
                        return a.select(d(this).data("index")), !1;
                    },
                });
        },
        handleKeys: function (e) {
            var t = this,
                s = e.which,
                i = t.options.keys,
                n = -1 < d.inArray(s, i.previous),
                a = -1 < d.inArray(s, i.next),
                r = -1 < d.inArray(s, i.select),
                i = -1 < d.inArray(s, i.open),
                o = t.state.highlightedIdx,
                l = (n && 0 === o) || (a && o + 1 === t.items.length),
                u = 0;
            if (((13 !== s && 32 !== s) || e.preventDefault(), n || a)) {
                if (!t.options.allowWrap && l) return;
                n && (u = t.utils.previousEnabledItem(t.lookupItems, o)), a && (u = t.utils.nextEnabledItem(t.lookupItems, o)), t.highlight(u);
            }
            if (r && t.state.opened) return t.select(o), void ((t.state.multiple && t.options.multiple.keepMenuOpen) || t.close());
            i && !t.state.opened && t.open();
        },
        refresh: function () {
            this.populate(), this.activate(), this.utils.triggerCallback("Refresh", this);
        },
        setOptionsDimensions: function () {
            var e = this,
                t = e.elements.items.closest(":visible").children(":hidden").addClass(e.classes.tempshow),
                s = e.options.maxHeight,
                i = e.elements.items.outerWidth(),
                n = e.elements.wrapper.outerWidth() - (i - e.elements.items.width());
            !e.options.expandToItemText || i < n
                ? (e.finalWidth = n)
                : (e.elements.items.css("overflow", "scroll"), e.elements.outerWrapper.width(9e4), (e.finalWidth = e.elements.items.width()), e.elements.items.css("overflow", ""), e.elements.outerWrapper.width("")),
                e.elements.items.width(e.finalWidth).height() > s && e.elements.items.height(s),
                t.removeClass(e.classes.tempshow);
        },
        isInViewport: function () {
            var e,
                t,
                s,
                i = this;
            !0 === i.options.forceRenderAbove
                ? i.elements.outerWrapper.addClass(i.classes.above)
                : !0 === i.options.forceRenderBelow
                ? i.elements.outerWrapper.addClass(i.classes.below)
                : ((t = n.scrollTop()),
                  (s = n.height()),
                  (s = (e = i.elements.outerWrapper.offset().top) + i.elements.outerWrapper.outerHeight() + i.itemsHeight <= t + s),
                  (e = e - i.itemsHeight > t),
                  (s = !(t = !s && e)),
                  i.elements.outerWrapper.toggleClass(i.classes.above, t),
                  i.elements.outerWrapper.toggleClass(i.classes.below, s));
        },
        detectItemVisibility: function (e) {
            var t = this,
                s = t.$li.filter("[data-index]"),
                i = (t.state.multiple && ((e = d.isArray(e) && 0 === e.length ? 0 : e), (e = d.isArray(e) ? Math.min.apply(Math, e) : e)), s.eq(e).outerHeight()),
                s = s[e].offsetTop,
                e = t.elements.itemsScroll.scrollTop(),
                n = s + 2 * i;
            t.elements.itemsScroll.scrollTop(n > e + t.itemsHeight ? n - t.itemsHeight : s - i < e ? s - i : e);
        },
        open: function (e) {
            var n = this;
            if (n.options.nativeOnMobile && n.utils.isMobile()) return !1;
            n.utils.triggerCallback("BeforeOpen", n),
                e && (e.preventDefault(), n.options.stopPropagation && e.stopPropagation()),
                n.state.enabled &&
                    (n.setOptionsDimensions(),
                    d("." + n.classes.hideselect, "." + n.classes.open)
                        .children()
                        [l]("close"),
                    (n.state.opened = !0),
                    (n.itemsHeight = n.elements.items.outerHeight()),
                    (n.itemsInnerHeight = n.elements.items.height()),
                    n.elements.outerWrapper.addClass(n.classes.open),
                    n.elements.input.val(""),
                    e && "focusin" !== e.type && n.elements.input.focus(),
                    setTimeout(function () {
                        t.on("click" + i, d.proxy(n.close, n)).on("scroll" + i, d.proxy(n.isInViewport, n));
                    }, 1),
                    n.isInViewport(),
                    n.options.preventWindowScroll &&
                        t.on("mousewheel.sl DOMMouseScroll" + i, "." + n.classes.scroll, function (e) {
                            var t = e.originalEvent,
                                s = d(this).scrollTop(),
                                i = 0;
                            "detail" in t && (i = -1 * t.detail),
                                "wheelDelta" in t && (i = t.wheelDelta),
                                "wheelDeltaY" in t && (i = t.wheelDeltaY),
                                "deltaY" in t && (i = -1 * t.deltaY),
                                ((s === this.scrollHeight - n.itemsInnerHeight && i < 0) || (0 === s && 0 < i)) && e.preventDefault();
                        }),
                    n.detectItemVisibility(n.state.selectedIdx),
                    n.highlight(n.state.multiple ? -1 : n.state.selectedIdx),
                    n.utils.triggerCallback("Open", n));
        },
        close: function () {
            var e = this;
            e.utils.triggerCallback("BeforeClose", e), t.off(i), e.elements.outerWrapper.removeClass(e.classes.open), (e.state.opened = !1), e.utils.triggerCallback("Close", e);
        },
        change: function () {
            var s = this;
            s.utils.triggerCallback("BeforeChange", s),
                s.state.multiple
                    ? (d.each(s.lookupItems, function (e) {
                          (s.lookupItems[e].selected = !1), s.$element.find("option").prop("selected", !1);
                      }),
                      d.each(s.state.selectedIdx, function (e, t) {
                          (s.lookupItems[t].selected = !0), s.$element.find("option").eq(t).prop("selected", !0);
                      }),
                      (s.state.currValue = s.state.selectedIdx),
                      s.setLabel(),
                      s.utils.triggerCallback("Change", s))
                    : s.state.currValue !== s.state.selectedIdx &&
                      (s.$element.prop("selectedIndex", (s.state.currValue = s.state.selectedIdx)).data("value", s.lookupItems[s.state.selectedIdx].text), s.setLabel(), s.utils.triggerCallback("Change", s));
        },
        highlight: function (e) {
            var t = this,
                s = t.$li.filter("[data-index]").removeClass("highlighted");
            t.utils.triggerCallback("BeforeHighlight", t),
                void 0 === e || -1 === e || t.lookupItems[e].disabled || (s.eq((t.state.highlightedIdx = e)).addClass("highlighted"), t.detectItemVisibility(e), t.utils.triggerCallback("Highlight", t));
        },
        select: function (e) {
            var t,
                s = this,
                i = s.$li.filter("[data-index]");
            s.utils.triggerCallback("BeforeSelect", s, e),
                void 0 === e ||
                    -1 === e ||
                    s.lookupItems[e].disabled ||
                    (s.state.multiple
                        ? ((s.state.selectedIdx = d.isArray(s.state.selectedIdx) ? s.state.selectedIdx : [s.state.selectedIdx]),
                          -1 !== (t = d.inArray(e, s.state.selectedIdx)) ? s.state.selectedIdx.splice(t, 1) : s.state.selectedIdx.push(e),
                          i
                              .removeClass("selected")
                              .filter(function (e) {
                                  return -1 !== d.inArray(e, s.state.selectedIdx);
                              })
                              .addClass("selected"))
                        : i
                              .removeClass("selected")
                              .eq((s.state.selectedIdx = e))
                              .addClass("selected"),
                    (s.state.multiple && s.options.multiple.keepMenuOpen) || s.close(),
                    s.change(),
                    s.utils.triggerCallback("Select", s, e));
        },
        destroy: function (e) {
            var t = this;
            t.state &&
                t.state.enabled &&
                (t.elements.items.add(t.elements.wrapper).add(t.elements.input).remove(),
                e || t.$element.removeData(l).removeData("value"),
                t.$element.prop("tabindex", t.originalTabindex).off(i).off(t.eventTriggers).unwrap().unwrap(),
                (t.state.enabled = !1));
        },
    }),
        (d.fn[l] = function (t) {
            return this.each(function () {
                var e = d.data(this, l);
                e && !e.disableOnMobile ? ("string" == typeof t && e[t] ? e[t]() : e.init(t)) : d.data(this, l, new s(this, t));
            });
        }),
        (d.fn[l].defaults = {
            onChange: function (e) {
                d(e).change();
            },
            maxHeight: 300,
            keySearchTimeout: 500,
            arrowButtonMarkup: '<b class="button">&#x25be;</b>',
            disableOnMobile: !1,
            nativeOnMobile: !0,
            openOnFocus: !0,
            openOnHover: !1,
            hoverIntentTimeout: 500,
            expandToItemText: !1,
            responsive: !1,
            preventWindowScroll: !0,
            inheritOriginalWidth: !1,
            allowWrap: !0,
            forceRenderAbove: !1,
            forceRenderBelow: !1,
            stopPropagation: !0,
            optionsItemBuilder: "{text}",
            labelBuilder: "{text}",
            listBuilder: !1,
            keys: { previous: [37, 38], next: [39, 40], select: [9, 13, 27], open: [13, 32, 37, 38, 39, 40], close: [9, 27] },
            customClass: { prefix: l, camelCase: !1 },
            multiple: { separator: ", ", keepMenuOpen: !0, maxLabelEntries: !1 },
        });
}),
    (function (e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && module.exports ? (module.exports = e(require("jquery"))) : e(jQuery);
    })(function (d) {
        d.extend(d.fn, {
            validate: function (e) {
                var i;
                {
                    if (this.length)
                        return (
                            (i = d.data(this[0], "validator")) ||
                            (this.attr("novalidate", "novalidate"),
                            (i = new d.validator(e, this[0])),
                            d.data(this[0], "validator", i),
                            i.settings.onsubmit &&
                                (this.on("click.validate", ":submit", function (e) {
                                    (i.submitButton = e.currentTarget), d(this).hasClass("cancel") && (i.cancelSubmit = !0), void 0 !== d(this).attr("formnovalidate") && (i.cancelSubmit = !0);
                                }),
                                this.on("submit.validate", function (s) {
                                    function e() {
                                        var e, t;
                                        return (
                                            i.submitButton && (i.settings.submitHandler || i.formSubmitted) && (e = d("<input type='hidden'/>").attr("name", i.submitButton.name).val(d(i.submitButton).val()).appendTo(i.currentForm)),
                                            !(i.settings.submitHandler && !i.settings.debug) || ((t = i.settings.submitHandler.call(i, i.currentForm, s)), e && e.remove(), void 0 !== t && t)
                                        );
                                    }
                                    return i.settings.debug && s.preventDefault(), i.cancelSubmit ? ((i.cancelSubmit = !1), e()) : i.form() ? (i.pendingRequest ? !(i.formSubmitted = !0) : e()) : (i.focusInvalid(), !1);
                                })),
                            i)
                        );
                    e && e.debug && window.console;
                }
            },
            valid: function () {
                var e, t, s;
                return (
                    d(this[0]).is("form")
                        ? (e = this.validate().form())
                        : ((s = []),
                          (e = !0),
                          (t = d(this[0].form).validate()),
                          this.each(function () {
                              (e = t.element(this) && e) || (s = s.concat(t.errorList));
                          }),
                          (t.errorList = s)),
                    e
                );
            },
            rules: function (e, t) {
                var s,
                    i,
                    n,
                    a,
                    r,
                    o = this[0],
                    l = void 0 !== this.attr("contenteditable") && "false" !== this.attr("contenteditable");
                if (null != o && (!o.form && l && ((o.form = this.closest("form")[0]), (o.name = this.attr("name"))), null != o.form)) {
                    if (e)
                        switch (((i = (s = d.data(o.form, "validator").settings).rules), (n = d.validator.staticRules(o)), e)) {
                            case "add":
                                d.extend(n, d.validator.normalizeRule(t)), delete n.messages, (i[o.name] = n), t.messages && (s.messages[o.name] = d.extend(s.messages[o.name], t.messages));
                                break;
                            case "remove":
                                return t
                                    ? ((r = {}),
                                      d.each(t.split(/\s/), function (e, t) {
                                          (r[t] = n[t]), delete n[t];
                                      }),
                                      r)
                                    : (delete i[o.name], n);
                        }
                    return (
                        (l = d.validator.normalizeRules(d.extend({}, d.validator.classRules(o), d.validator.attributeRules(o), d.validator.dataRules(o), d.validator.staticRules(o)), o)).required &&
                            ((a = l.required), delete l.required, (l = d.extend({ required: a }, l))),
                        l.remote && ((a = l.remote), delete l.remote, (l = d.extend(l, { remote: a }))),
                        l
                    );
                }
            },
        });
        function t(e) {
            return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
        }
        d.extend(d.expr.pseudos || d.expr[":"], {
            blank: function (e) {
                return !t("" + d(e).val());
            },
            filled: function (e) {
                e = d(e).val();
                return null !== e && !!t("" + e);
            },
            unchecked: function (e) {
                return !d(e).prop("checked");
            },
        }),
            (d.validator = function (e, t) {
                (this.settings = d.extend(!0, {}, d.validator.defaults, e)), (this.currentForm = t), this.init();
            }),
            (d.validator.format = function (s, e) {
                return 1 === arguments.length
                    ? function () {
                          var e = d.makeArray(arguments);
                          return e.unshift(s), d.validator.format.apply(this, e);
                      }
                    : (void 0 === e ||
                          ((e = 2 < arguments.length && e.constructor !== Array ? d.makeArray(arguments).slice(1) : e).constructor !== Array && (e = [e]),
                          d.each(e, function (e, t) {
                              s = s.replace(new RegExp("\\{" + e + "\\}", "g"), function () {
                                  return t;
                              });
                          })),
                      s);
            }),
            d.extend(d.validator, {
                defaults: {
                    messages: {},
                    groups: {},
                    rules: {},
                    errorClass: "error",
                    pendingClass: "pending",
                    validClass: "valid",
                    errorElement: "label",
                    focusCleanup: !1,
                    focusInvalid: !0,
                    errorContainer: d([]),
                    errorLabelContainer: d([]),
                    onsubmit: !0,
                    ignore: ":hidden",
                    ignoreTitle: !1,
                    onfocusin: function (e) {
                        (this.lastActive = e), this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, e, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(e)));
                    },
                    onfocusout: function (e) {
                        this.checkable(e) || (!(e.name in this.submitted) && this.optional(e)) || this.element(e);
                    },
                    onkeyup: function (e, t) {
                        (9 === t.which && "" === this.elementValue(e)) || -1 !== d.inArray(t.keyCode, [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225]) || ((e.name in this.submitted || e.name in this.invalid) && this.element(e));
                    },
                    onclick: function (e) {
                        e.name in this.submitted ? this.element(e) : e.parentNode.name in this.submitted && this.element(e.parentNode);
                    },
                    highlight: function (e, t, s) {
                        ("radio" === e.type ? this.findByName(e.name) : d(e)).addClass(t).removeClass(s);
                    },
                    unhighlight: function (e, t, s) {
                        ("radio" === e.type ? this.findByName(e.name) : d(e)).removeClass(t).addClass(s);
                    },
                },
                setDefaults: function (e) {
                    d.extend(d.validator.defaults, e);
                },
                messages: {
                    required: "This field is required.",
                    remote: "Please fix this field.",
                    email: "Please enter a valid email address.",
                    url: "Please enter a valid URL.",
                    date: "Please enter a valid date.",
                    dateISO: "Please enter a valid date (ISO).",
                    number: "Please enter a valid number.",
                    digits: "Please enter only digits.",
                    equalTo: "Please enter the same value again.",
                    maxlength: d.validator.format("Please enter no more than {0} characters."),
                    minlength: d.validator.format("Please enter at least {0} characters."),
                    rangelength: d.validator.format("Please enter a value between {0} and {1} characters long."),
                    range: d.validator.format("Please enter a value between {0} and {1}."),
                    max: d.validator.format("Please enter a value less than or equal to {0}."),
                    min: d.validator.format("Please enter a value greater than or equal to {0}."),
                    step: d.validator.format("Please enter a multiple of {0}."),
                },
                autoCreateRanges: !1,
                prototype: {
                    init: function () {
                        (this.labelContainer = d(this.settings.errorLabelContainer)),
                            (this.errorContext = (this.labelContainer.length && this.labelContainer) || d(this.currentForm)),
                            (this.containers = d(this.settings.errorContainer).add(this.settings.errorLabelContainer)),
                            (this.submitted = {}),
                            (this.valueCache = {}),
                            (this.pendingRequest = 0),
                            (this.pending = {}),
                            (this.invalid = {}),
                            this.reset();
                        var s,
                            n = this.currentForm,
                            i = (this.groups = {});
                        function e(e) {
                            var t,
                                s,
                                i = void 0 !== d(this).attr("contenteditable") && "false" !== d(this).attr("contenteditable");
                            !this.form && i && ((this.form = d(this).closest("form")[0]), (this.name = d(this).attr("name"))),
                                n === this.form && ((i = d.data(this.form, "validator")), (t = "on" + e.type.replace(/^validate/, "")), (s = i.settings)[t] && !d(this).is(s.ignore) && s[t].call(i, this, e));
                        }
                        d.each(this.settings.groups, function (s, e) {
                            "string" == typeof e && (e = e.split(/\s/)),
                                d.each(e, function (e, t) {
                                    i[t] = s;
                                });
                        }),
                            (s = this.settings.rules),
                            d.each(s, function (e, t) {
                                s[e] = d.validator.normalizeRule(t);
                            }),
                            d(this.currentForm)
                                .on(
                                    "focusin.validate focusout.validate keyup.validate",
                                    ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable], [type='button']",
                                    e
                                )
                                .on("click.validate", "select, option, [type='radio'], [type='checkbox']", e),
                            this.settings.invalidHandler && d(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler);
                    },
                    form: function () {
                        return (
                            this.checkForm(), d.extend(this.submitted, this.errorMap), (this.invalid = d.extend({}, this.errorMap)), this.valid() || d(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
                        );
                    },
                    checkForm: function () {
                        this.prepareForm();
                        for (var e = 0, t = (this.currentElements = this.elements()); t[e]; e++) this.check(t[e]);
                        return this.valid();
                    },
                    element: function (e) {
                        var t,
                            s,
                            i = this.clean(e),
                            n = this.validationTargetFor(i),
                            a = this,
                            r = !0;
                        return (
                            void 0 === n
                                ? delete this.invalid[i.name]
                                : (this.prepareElement(n),
                                  (this.currentElements = d(n)),
                                  (s = this.groups[n.name]) &&
                                      d.each(this.groups, function (e, t) {
                                          t === s && e !== n.name && (i = a.validationTargetFor(a.clean(a.findByName(e)))) && i.name in a.invalid && (a.currentElements.push(i), (r = a.check(i) && r));
                                      }),
                                  (t = !1 !== this.check(n)),
                                  (r = r && t),
                                  (this.invalid[n.name] = !t),
                                  this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)),
                                  this.showErrors(),
                                  d(e).attr("aria-invalid", !t)),
                            r
                        );
                    },
                    showErrors: function (t) {
                        var s;
                        t &&
                            (d.extend((s = this).errorMap, t),
                            (this.errorList = d.map(this.errorMap, function (e, t) {
                                return { message: e, element: s.findByName(t)[0] };
                            })),
                            (this.successList = d.grep(this.successList, function (e) {
                                return !(e.name in t);
                            }))),
                            this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors();
                    },
                    resetForm: function () {
                        d.fn.resetForm && d(this.currentForm).resetForm(), (this.invalid = {}), (this.submitted = {}), this.prepareForm(), this.hideErrors();
                        var e = this.elements().removeData("previousValue").removeAttr("aria-invalid");
                        this.resetElements(e);
                    },
                    resetElements: function (e) {
                        var t;
                        if (this.settings.unhighlight) for (t = 0; e[t]; t++) this.settings.unhighlight.call(this, e[t], this.settings.errorClass, ""), this.findByName(e[t].name).removeClass(this.settings.validClass);
                        else e.removeClass(this.settings.errorClass).removeClass(this.settings.validClass);
                    },
                    numberOfInvalids: function () {
                        return this.objectLength(this.invalid);
                    },
                    objectLength: function (e) {
                        var t,
                            s = 0;
                        for (t in e) void 0 !== e[t] && null !== e[t] && !1 !== e[t] && s++;
                        return s;
                    },
                    hideErrors: function () {
                        this.hideThese(this.toHide);
                    },
                    hideThese: function (e) {
                        e.not(this.containers).text(""), this.addWrapper(e).hide();
                    },
                    valid: function () {
                        return 0 === this.size();
                    },
                    size: function () {
                        return this.errorList.length;
                    },
                    focusInvalid: function () {
                        if (this.settings.focusInvalid)
                            try {
                                d(this.findLastActive() || (this.errorList.length && this.errorList[0].element) || [])
                                    .filter(":visible")
                                    .trigger("focus")
                                    .trigger("focusin");
                            } catch (e) {}
                    },
                    findLastActive: function () {
                        var t = this.lastActive;
                        return (
                            t &&
                            1 ===
                                d.grep(this.errorList, function (e) {
                                    return e.element.name === t.name;
                                }).length &&
                            t
                        );
                    },
                    elements: function () {
                        var s = this,
                            i = {};
                        return d(this.currentForm)
                            .find("input, select, textarea, [contenteditable]")
                            .not(":submit, :reset, :image, :disabled")
                            .not(this.settings.ignore)
                            .filter(function () {
                                var e = this.name || d(this).attr("name"),
                                    t = void 0 !== d(this).attr("contenteditable") && "false" !== d(this).attr("contenteditable");
                                return !e && s.settings.debug && window.console, t && ((this.form = d(this).closest("form")[0]), (this.name = e)), this.form === s.currentForm && !(e in i || !s.objectLength(d(this).rules())) && (i[e] = !0);
                            });
                    },
                    clean: function (e) {
                        return d(e)[0];
                    },
                    errors: function () {
                        var e = this.settings.errorClass.split(" ").join(".");
                        return d(this.settings.errorElement + "." + e, this.errorContext);
                    },
                    resetInternals: function () {
                        (this.successList = []), (this.errorList = []), (this.errorMap = {}), (this.toShow = d([])), (this.toHide = d([]));
                    },
                    reset: function () {
                        this.resetInternals(), (this.currentElements = d([]));
                    },
                    prepareForm: function () {
                        this.reset(), (this.toHide = this.errors().add(this.containers));
                    },
                    prepareElement: function (e) {
                        this.reset(), (this.toHide = this.errorsFor(e));
                    },
                    elementValue: function (e) {
                        var t = d(e),
                            s = e.type,
                            i = void 0 !== t.attr("contenteditable") && "false" !== t.attr("contenteditable");
                        return "radio" === s || "checkbox" === s
                            ? this.findByName(e.name).filter(":checked").val()
                            : "number" === s && void 0 !== e.validity
                            ? e.validity.badInput
                                ? "NaN"
                                : t.val()
                            : ((e = i ? t.text() : t.val()),
                              "file" === s ? ("C:\\fakepath\\" === e.substr(0, 12) ? e.substr(12) : 0 <= (i = e.lastIndexOf("/")) || 0 <= (i = e.lastIndexOf("\\")) ? e.substr(i + 1) : e) : "string" == typeof e ? e.replace(/\r/g, "") : e);
                    },
                    check: function (t) {
                        t = this.validationTargetFor(this.clean(t));
                        var e,
                            s,
                            i,
                            n,
                            a = d(t).rules(),
                            r = d.map(a, function (e, t) {
                                return t;
                            }).length,
                            o = !1,
                            l = this.elementValue(t);
                        for (s in ("function" == typeof a.normalizer ? (n = a.normalizer) : "function" == typeof this.settings.normalizer && (n = this.settings.normalizer), n && ((l = n.call(t, l)), delete a.normalizer), a)) {
                            i = { method: s, parameters: a[s] };
                            try {
                                if ("dependency-mismatch" === (e = d.validator.methods[s].call(this, l, t, i.parameters)) && 1 === r) {
                                    o = !0;
                                    continue;
                                }
                                if (((o = !1), "pending" === e)) return void (this.toHide = this.toHide.not(this.errorsFor(t)));
                                if (!e) return this.formatAndAdd(t, i), !1;
                            } catch (e) {
                                throw (this.settings.debug && window.console, e instanceof TypeError && (e.message += ".  Exception occurred when checking element " + t.id + ", check the '" + i.method + "' method."), e);
                            }
                        }
                        if (!o) return this.objectLength(a) && this.successList.push(t), !0;
                    },
                    customDataMessage: function (e, t) {
                        return d(e).data("msg" + t.charAt(0).toUpperCase() + t.substring(1).toLowerCase()) || d(e).data("msg");
                    },
                    customMessage: function (e, t) {
                        e = this.settings.messages[e];
                        return e && (e.constructor === String ? e : e[t]);
                    },
                    findDefined: function () {
                        for (var e = 0; e < arguments.length; e++) if (void 0 !== arguments[e]) return arguments[e];
                    },
                    defaultMessage: function (e, t) {
                        var s = this.findDefined(
                                this.customMessage(e.name, (t = "string" == typeof t ? { method: t } : t).method),
                                this.customDataMessage(e, t.method),
                                (!this.settings.ignoreTitle && e.title) || void 0,
                                d.validator.messages[t.method],
                                "<strong>Warning: No message defined for " + e.name + "</strong>"
                            ),
                            i = /\$?\{(\d+)\}/g;
                        return "function" == typeof s ? (s = s.call(this, t.parameters, e)) : i.test(s) && (s = d.validator.format(s.replace(i, "{$1}"), t.parameters)), s;
                    },
                    formatAndAdd: function (e, t) {
                        var s = this.defaultMessage(e, t);
                        this.errorList.push({ message: s, element: e, method: t.method }), (this.errorMap[e.name] = s), (this.submitted[e.name] = s);
                    },
                    addWrapper: function (e) {
                        return (e = this.settings.wrapper ? e.add(e.parent(this.settings.wrapper)) : e);
                    },
                    defaultShowErrors: function () {
                        for (var e, t, s = 0; this.errorList[s]; s++)
                            (t = this.errorList[s]), this.settings.highlight && this.settings.highlight.call(this, t.element, this.settings.errorClass, this.settings.validClass), this.showLabel(t.element, t.message);
                        if ((this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)) for (s = 0; this.successList[s]; s++) this.showLabel(this.successList[s]);
                        if (this.settings.unhighlight) for (s = 0, e = this.validElements(); e[s]; s++) this.settings.unhighlight.call(this, e[s], this.settings.errorClass, this.settings.validClass);
                        (this.toHide = this.toHide.not(this.toShow)), this.hideErrors(), this.addWrapper(this.toShow).show();
                    },
                    validElements: function () {
                        return this.currentElements.not(this.invalidElements());
                    },
                    invalidElements: function () {
                        return d(this.errorList).map(function () {
                            return this.element;
                        });
                    },
                    showLabel: function (e, t) {
                        var s,
                            i,
                            n,
                            a = this.errorsFor(e),
                            r = this.idOrName(e),
                            o = d(e).attr("aria-describedby");
                        a.length
                            ? (a.removeClass(this.settings.validClass).addClass(this.settings.errorClass), a.html(t))
                            : ((i = a = d("<" + this.settings.errorElement + ">")
                                  .attr("id", r + "-error")
                                  .addClass(this.settings.errorClass)
                                  .html(t || "")),
                              this.settings.wrapper &&
                                  (i = a
                                      .hide()
                                      .show()
                                      .wrap("<" + this.settings.wrapper + "/>")
                                      .parent()),
                              this.labelContainer.length ? this.labelContainer.append(i) : this.settings.errorPlacement ? this.settings.errorPlacement.call(this, i, d(e)) : i.insertAfter(e),
                              a.is("label")
                                  ? a.attr("for", r)
                                  : 0 === a.parents("label[for='" + this.escapeCssMeta(r) + "']").length &&
                                    ((i = a.attr("id")),
                                    o ? o.match(new RegExp("\\b" + this.escapeCssMeta(i) + "\\b")) || (o += " " + i) : (o = i),
                                    d(e).attr("aria-describedby", o),
                                    (s = this.groups[e.name]) &&
                                        d.each((n = this).groups, function (e, t) {
                                            t === s && d("[name='" + n.escapeCssMeta(e) + "']", n.currentForm).attr("aria-describedby", a.attr("id"));
                                        }))),
                            !t && this.settings.success && (a.text(""), "string" == typeof this.settings.success ? a.addClass(this.settings.success) : this.settings.success(a, e)),
                            (this.toShow = this.toShow.add(a));
                    },
                    errorsFor: function (e) {
                        var t = this.escapeCssMeta(this.idOrName(e)),
                            e = d(e).attr("aria-describedby"),
                            t = "label[for='" + t + "'], label[for='" + t + "'] *";
                        return e && (t = t + ", #" + this.escapeCssMeta(e).replace(/\s+/g, ", #")), this.errors().filter(t);
                    },
                    escapeCssMeta: function (e) {
                        return e.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1");
                    },
                    idOrName: function (e) {
                        return this.groups[e.name] || (!this.checkable(e) && e.id) || e.name;
                    },
                    validationTargetFor: function (e) {
                        return this.checkable(e) && (e = this.findByName(e.name)), d(e).not(this.settings.ignore)[0];
                    },
                    checkable: function (e) {
                        return /radio|checkbox/i.test(e.type);
                    },
                    findByName: function (e) {
                        return d(this.currentForm).find("[name='" + this.escapeCssMeta(e) + "']");
                    },
                    getLength: function (e, t) {
                        switch (t.nodeName.toLowerCase()) {
                            case "select":
                                return d("option:selected", t).length;
                            case "input":
                                if (this.checkable(t)) return this.findByName(t.name).filter(":checked").length;
                        }
                        return e.length;
                    },
                    depend: function (e, t) {
                        return !this.dependTypes[typeof e] || this.dependTypes[typeof e](e, t);
                    },
                    dependTypes: {
                        boolean: function (e) {
                            return e;
                        },
                        string: function (e, t) {
                            return !!d(e, t.form).length;
                        },
                        function: function (e, t) {
                            return e(t);
                        },
                    },
                    optional: function (e) {
                        var t = this.elementValue(e);
                        return !d.validator.methods.required.call(this, t, e) && "dependency-mismatch";
                    },
                    startRequest: function (e) {
                        this.pending[e.name] || (this.pendingRequest++, d(e).addClass(this.settings.pendingClass), (this.pending[e.name] = !0));
                    },
                    stopRequest: function (e, t) {
                        this.pendingRequest--,
                            this.pendingRequest < 0 && (this.pendingRequest = 0),
                            delete this.pending[e.name],
                            d(e).removeClass(this.settings.pendingClass),
                            t && 0 === this.pendingRequest && this.formSubmitted && this.form()
                                ? (d(this.currentForm).submit(), this.submitButton && d("input:hidden[name='" + this.submitButton.name + "']", this.currentForm).remove(), (this.formSubmitted = !1))
                                : !t && 0 === this.pendingRequest && this.formSubmitted && (d(this.currentForm).triggerHandler("invalid-form", [this]), (this.formSubmitted = !1));
                    },
                    previousValue: function (e, t) {
                        return (t = ("string" == typeof t && t) || "remote"), d.data(e, "previousValue") || d.data(e, "previousValue", { old: null, valid: !0, message: this.defaultMessage(e, { method: t }) });
                    },
                    destroy: function () {
                        this.resetForm(),
                            d(this.currentForm)
                                .off(".validate")
                                .removeData("validator")
                                .find(".validate-equalTo-blur")
                                .off(".validate-equalTo")
                                .removeClass("validate-equalTo-blur")
                                .find(".validate-lessThan-blur")
                                .off(".validate-lessThan")
                                .removeClass("validate-lessThan-blur")
                                .find(".validate-lessThanEqual-blur")
                                .off(".validate-lessThanEqual")
                                .removeClass("validate-lessThanEqual-blur")
                                .find(".validate-greaterThanEqual-blur")
                                .off(".validate-greaterThanEqual")
                                .removeClass("validate-greaterThanEqual-blur")
                                .find(".validate-greaterThan-blur")
                                .off(".validate-greaterThan")
                                .removeClass("validate-greaterThan-blur");
                    },
                },
                classRuleSettings: { required: { required: !0 }, email: { email: !0 }, url: { url: !0 }, date: { date: !0 }, dateISO: { dateISO: !0 }, number: { number: !0 }, digits: { digits: !0 }, creditcard: { creditcard: !0 } },
                addClassRules: function (e, t) {
                    e.constructor === String ? (this.classRuleSettings[e] = t) : d.extend(this.classRuleSettings, e);
                },
                classRules: function (e) {
                    var t = {},
                        e = d(e).attr("class");
                    return (
                        e &&
                            d.each(e.split(" "), function () {
                                this in d.validator.classRuleSettings && d.extend(t, d.validator.classRuleSettings[this]);
                            }),
                        t
                    );
                },
                normalizeAttributeRule: function (e, t, s, i) {
                    /min|max|step/.test(s) && (null === t || /number|range|text/.test(t)) && ((i = Number(i)), isNaN(i) && (i = void 0)), i || 0 === i ? (e[s] = i) : t === s && "range" !== t && (e[s] = !0);
                },
                attributeRules: function (e) {
                    var t,
                        s,
                        i = {},
                        n = d(e),
                        a = e.getAttribute("type");
                    for (t in d.validator.methods) (s = "required" === t ? !!(s = "" === (s = e.getAttribute(t)) ? !0 : s) : n.attr(t)), this.normalizeAttributeRule(i, a, t, s);
                    return i.maxlength && /-1|2147483647|524288/.test(i.maxlength) && delete i.maxlength, i;
                },
                dataRules: function (e) {
                    var t,
                        s,
                        i = {},
                        n = d(e),
                        a = e.getAttribute("type");
                    for (t in d.validator.methods) "" === (s = n.data("rule" + t.charAt(0).toUpperCase() + t.substring(1).toLowerCase())) && (s = !0), this.normalizeAttributeRule(i, a, t, s);
                    return i;
                },
                staticRules: function (e) {
                    var t = {},
                        s = d.data(e.form, "validator");
                    return (t = s.settings.rules ? d.validator.normalizeRule(s.settings.rules[e.name]) || {} : t);
                },
                normalizeRules: function (i, n) {
                    return (
                        d.each(i, function (e, t) {
                            if (!1 !== t) {
                                if (t.param || t.depends) {
                                    var s = !0;
                                    switch (typeof t.depends) {
                                        case "string":
                                            s = !!d(t.depends, n.form).length;
                                            break;
                                        case "function":
                                            s = t.depends.call(n, n);
                                    }
                                    s ? (i[e] = void 0 === t.param || t.param) : (d.data(n.form, "validator").resetElements(d(n)), delete i[e]);
                                }
                            } else delete i[e];
                        }),
                        d.each(i, function (e, t) {
                            i[e] = "function" == typeof t && "normalizer" !== e ? t(n) : t;
                        }),
                        d.each(["minlength", "maxlength"], function () {
                            i[this] && (i[this] = Number(i[this]));
                        }),
                        d.each(["rangelength", "range"], function () {
                            var e;
                            i[this] &&
                                (Array.isArray(i[this])
                                    ? (i[this] = [Number(i[this][0]), Number(i[this][1])])
                                    : "string" == typeof i[this] && ((e = i[this].replace(/[\[\]]/g, "").split(/[\s,]+/)), (i[this] = [Number(e[0]), Number(e[1])])));
                        }),
                        d.validator.autoCreateRanges &&
                            (null != i.min && null != i.max && ((i.range = [i.min, i.max]), delete i.min, delete i.max),
                            null != i.minlength && null != i.maxlength && ((i.rangelength = [i.minlength, i.maxlength]), delete i.minlength, delete i.maxlength)),
                        i
                    );
                },
                normalizeRule: function (e) {
                    var t;
                    return (
                        "string" == typeof e &&
                            ((t = {}),
                            d.each(e.split(/\s/), function () {
                                t[this] = !0;
                            }),
                            (e = t)),
                        e
                    );
                },
                addMethod: function (e, t, s) {
                    (d.validator.methods[e] = t), (d.validator.messages[e] = void 0 !== s ? s : d.validator.messages[e]), t.length < 3 && d.validator.addClassRules(e, d.validator.normalizeRule(e));
                },
                methods: {
                    required: function (e, t, s) {
                        return this.depend(s, t) ? ("select" === t.nodeName.toLowerCase() ? (s = d(t).val()) && 0 < s.length : this.checkable(t) ? 0 < this.getLength(e, t) : null != e && 0 < e.length) : "dependency-mismatch";
                    },
                    email: function (e, t) {
                        return this.optional(t) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(e);
                    },
                    url: function (e, t) {
                        return (
                            this.optional(t) ||
                            /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
                                e
                            )
                        );
                    },
                    date:
                        ((s = !1),
                        function (e, t) {
                            return s || ((s = !0), this.settings.debug && window.console), this.optional(t) || !/Invalid|NaN/.test(new Date(e).toString());
                        }),
                    dateISO: function (e, t) {
                        return this.optional(t) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(e);
                    },
                    number: function (e, t) {
                        return this.optional(t) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(e);
                    },
                    digits: function (e, t) {
                        return this.optional(t) || /^\d+$/.test(e);
                    },
                    minlength: function (e, t, s) {
                        e = Array.isArray(e) ? e.length : this.getLength(e, t);
                        return this.optional(t) || s <= e;
                    },
                    maxlength: function (e, t, s) {
                        e = Array.isArray(e) ? e.length : this.getLength(e, t);
                        return this.optional(t) || e <= s;
                    },
                    rangelength: function (e, t, s) {
                        e = Array.isArray(e) ? e.length : this.getLength(e, t);
                        return this.optional(t) || (e >= s[0] && e <= s[1]);
                    },
                    min: function (e, t, s) {
                        return this.optional(t) || s <= e;
                    },
                    max: function (e, t, s) {
                        return this.optional(t) || e <= s;
                    },
                    range: function (e, t, s) {
                        return this.optional(t) || (e >= s[0] && e <= s[1]);
                    },
                    step: function (e, t, s) {
                        function i(e) {
                            return (e = ("" + e).match(/(?:\.(\d+))?$/)) && e[1] ? e[1].length : 0;
                        }
                        function n(e) {
                            return Math.round(e * Math.pow(10, a));
                        }
                        var a,
                            r = d(t).attr("type"),
                            o = "Step attribute on input type " + r + " is not supported.",
                            l = new RegExp("\\b" + r + "\\b"),
                            u = !0;
                        if (r && !l.test(["text", "number", "range"].join())) throw new Error(o);
                        return (a = i(s)), (i(e) > a || n(e) % n(s) != 0) && (u = !1), this.optional(t) || u;
                    },
                    equalTo: function (e, t, s) {
                        s = d(s);
                        return (
                            this.settings.onfocusout &&
                                s.not(".validate-equalTo-blur").length &&
                                s.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
                                    d(t).valid();
                                }),
                            e === s.val()
                        );
                    },
                    remote: function (i, n, e, a) {
                        if (this.optional(n)) return "dependency-mismatch";
                        a = ("string" == typeof a && a) || "remote";
                        var r,
                            t,
                            o = this.previousValue(n, a);
                        return (
                            this.settings.messages[n.name] || (this.settings.messages[n.name] = {}),
                            (o.originalMessage = o.originalMessage || this.settings.messages[n.name][a]),
                            (this.settings.messages[n.name][a] = o.message),
                            (t = d.param(d.extend({ data: i }, (e = "string" == typeof e ? { url: e } : e).data))),
                            o.old === t
                                ? o.valid
                                : ((o.old = t),
                                  (r = this).startRequest(n),
                                  ((t = {})[n.name] = i),
                                  d.ajax(
                                      d.extend(
                                          !0,
                                          {
                                              mode: "abort",
                                              port: "validate" + n.name,
                                              dataType: "json",
                                              data: t,
                                              context: r.currentForm,
                                              success: function (e) {
                                                  var t,
                                                      s = !0 === e || "true" === e;
                                                  (r.settings.messages[n.name][a] = o.originalMessage),
                                                      s
                                                          ? ((t = r.formSubmitted), r.resetInternals(), (r.toHide = r.errorsFor(n)), (r.formSubmitted = t), r.successList.push(n), (r.invalid[n.name] = !1), r.showErrors())
                                                          : ((t = {}), (e = e || r.defaultMessage(n, { method: a, parameters: i })), (t[n.name] = o.message = e), (r.invalid[n.name] = !0), r.showErrors(t)),
                                                      (o.valid = s),
                                                      r.stopRequest(n, s);
                                              },
                                          },
                                          e
                                      )
                                  ),
                                  "pending")
                        );
                    },
                },
            });
        var s,
            i,
            n = {};
        return (
            d.ajaxPrefilter
                ? d.ajaxPrefilter(function (e, t, s) {
                      var i = e.port;
                      "abort" === e.mode && (n[i] && n[i].abort(), (n[i] = s));
                  })
                : ((i = d.ajax),
                  (d.ajax = function (e) {
                      var t = ("mode" in e ? e : d.ajaxSettings).mode,
                          s = ("port" in e ? e : d.ajaxSettings).port;
                      return "abort" === t ? (n[s] && n[s].abort(), (n[s] = i.apply(this, arguments)), n[s]) : i.apply(this, arguments);
                  })),
            d
        );
    }),
    (function (s) {
        "use strict";
        var e,
            t = (function () {
                try {
                    if (s.URLSearchParams && "bar" === new s.URLSearchParams("foo=bar").get("foo")) return s.URLSearchParams;
                } catch (e) {}
                return null;
            })(),
            l = t && "a=1" === new t({ a: 1 }).toString(),
            c = t && "+" === new t("s=%2B").get("s"),
            r = "__URLSearchParams__",
            i = !t || ((i = new t()).append("s", " &"), "s=+%26" === i.toString()),
            n = a.prototype,
            h = !(!s.Symbol || !s.Symbol.iterator);
        function a(e) {
            ((e = e || "") instanceof URLSearchParams || e instanceof a) && (e = e.toString()), (this[r] = p(e));
        }
        function m(e) {
            var t = { "!": "%21", "'": "%27", "(": "%28", ")": "%29", "~": "%7E", "%20": "+", "%00": "\0" };
            return encodeURIComponent(e).replace(/[!'\(\)~]|%20|%00/g, function (e) {
                return t[e];
            });
        }
        function u(e) {
            return e.replace(/[ +]/g, "%20").replace(/(%[a-f0-9]{2})+/gi, function (e) {
                return decodeURIComponent(e);
            });
        }
        function o(t) {
            var e = {
                next: function () {
                    var e = t.shift();
                    return { done: void 0 === e, value: e };
                },
            };
            return (
                h &&
                    (e[s.Symbol.iterator] = function () {
                        return e;
                    }),
                e
            );
        }
        function p(e) {
            var t = {};
            if ("object" == typeof e)
                if (f(e))
                    for (var s = 0; s < e.length; s++) {
                        var i = e[s];
                        if (!f(i) || 2 !== i.length) throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
                        d(t, i[0], i[1]);
                    }
                else for (var n in e) e.hasOwnProperty(n) && d(t, n, e[n]);
            else
                for (var a = (e = 0 === e.indexOf("?") ? e.slice(1) : e).split("&"), r = 0; r < a.length; r++) {
                    var o = a[r],
                        l = o.indexOf("=");
                    -1 < l ? d(t, u(o.slice(0, l)), u(o.slice(l + 1))) : o && d(t, u(o), "");
                }
            return t;
        }
        function d(e, t, s) {
            s = "string" == typeof s ? s : null != s && "function" == typeof s.toString ? s.toString() : JSON.stringify(s);
            g(e, t) ? e[t].push(s) : (e[t] = [s]);
        }
        function f(e) {
            return e && "[object Array]" === Object.prototype.toString.call(e);
        }
        function g(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
        }
        (t && l && c && i) ||
            ((n.append = function (e, t) {
                d(this[r], e, t);
            }),
            (n.delete = function (e) {
                delete this[r][e];
            }),
            (n.get = function (e) {
                var t = this[r];
                return this.has(e) ? t[e][0] : null;
            }),
            (n.getAll = function (e) {
                var t = this[r];
                return this.has(e) ? t[e].slice(0) : [];
            }),
            (n.has = function (e) {
                return g(this[r], e);
            }),
            (n.set = function (e, t) {
                this[r][e] = ["" + t];
            }),
            (n.toString = function () {
                var e,
                    t,
                    s,
                    i,
                    n = this[r],
                    a = [];
                for (t in n) for (s = m(t), e = 0, i = n[t]; e < i.length; e++) a.push(s + "=" + m(i[e]));
                return a.join("&");
            }),
            !!c && t && !l && s.Proxy
                ? ((e = new Proxy(t, {
                      construct: function (e, t) {
                          return new e(new a(t[0]).toString());
                      },
                  })).toString = Function.prototype.toString.bind(a))
                : (e = a),
            Object.defineProperty(s, "URLSearchParams", { value: e }),
            ((n = s.URLSearchParams.prototype).polyfill = !0),
            (n.forEach =
                n.forEach ||
                function (s, i) {
                    var e = p(this.toString());
                    Object.getOwnPropertyNames(e).forEach(function (t) {
                        e[t].forEach(function (e) {
                            s.call(i, e, t, this);
                        }, this);
                    }, this);
                }),
            (n.sort =
                n.sort ||
                function () {
                    var e,
                        t,
                        s = p(this.toString()),
                        i = [];
                    for (e in s) i.push(e);
                    for (i.sort(), t = 0; t < i.length; t++) this.delete(i[t]);
                    for (t = 0; t < i.length; t++) for (var n = i[t], a = s[n], r = 0; r < a.length; r++) this.append(n, a[r]);
                }),
            (n.keys =
                n.keys ||
                function () {
                    var s = [];
                    return (
                        this.forEach(function (e, t) {
                            s.push(t);
                        }),
                        o(s)
                    );
                }),
            (n.values =
                n.values ||
                function () {
                    var t = [];
                    return (
                        this.forEach(function (e) {
                            t.push(e);
                        }),
                        o(t)
                    );
                }),
            (n.entries =
                n.entries ||
                function () {
                    var s = [];
                    return (
                        this.forEach(function (e, t) {
                            s.push([t, e]);
                        }),
                        o(s)
                    );
                }),
            h && (n[s.Symbol.iterator] = n[s.Symbol.iterator] || n.entries));
    })("undefined" != typeof global ? global : "undefined" != typeof window ? window : this),
    jQuery(document).ready(function (m) {
        var s = (window.omniJobs = window.omniJobs || {}),
            e = Number(omniJobsPublic.job_id),
            e = (e && !isNaN(e) && m.post(omniJobsPublic.ajaxurl, { action: "omni_view_count", omni_job_id: e }), m(".omni-application-form")),
            i =
                ((s.submitApplication = function (n, e) {
                    e = void 0 !== e ? e : {};
                    var s,
                        t = n.find(".omni-application-submit-btn"),
                        a = n.parents(".omni-job-form-inner").find(".omni-application-message"),
                        i = t.val(),
                        d = t.data("responseText"),
                        r = "omni-success-message",
                        o = "omni-error-message",
                        c = (m(".omni-application-message").hide(), n[0]),
                        l = !0,
                        u = n.find(".omni-form-file-control"),
                        h = omniJobsPublic.wp_max_upload_size;
                    0 < u.length &&
                        u.each(function () {
                            var e = m(this),
                                e = void 0 !== e.prop("files")[0] && e.prop("files")[0] ? e.prop("files")[0].size : 0;
                            h < e && (l = !1);
                        }),
                        !1 === l
                            ? a.addClass(o).html(omniJobsPublic.i18n.form_error_msg.file_validation).fadeIn()
                            : (a.removeClass(r + " " + o).hide(),
                              t.prop("disabled", !0).val(d).addClass("omni-application-submit-btn-disabled"),
                              (s = new FormData(c)),
                              "fields" in e &&
                                  Array.isArray(e.fields) &&
                                  m.each(e.fields, function (e, t) {
                                      "name" in t && "value" in t && s.append(t.name, t.value);
                                  }),
                              m
                                  .ajax({ url: omniJobsPublic.ajaxurl, cache: !1, contentType: !1, processData: !1, data: s, dataType: "json", type: "POST" })
                                  .done(function (e) {
                                      var t, s, i;
                                      e &&
                                          ((t = "omni-default-message"),
                                          (s = ""),
                                          (i = []),
                                          0 < e.error.length
                                              ? ((t = o), (i = e.error), n.trigger("omnijobs_application_failed", [e]))
                                              : 0 < e.success.length && (n[0].reset(), (t = r), (i = e.success), n.trigger("omnijobs_application_submitted", [e])),
                                          m(i).each(function (e, t) {
                                              s += "<p>" + t + "</p>";
                                          }),
                                          a.addClass(t).html(s).fadeIn());
                                  })
                                  .fail(function (e) {
                                      a.addClass(o).html(omniJobsPublic.i18n.form_error_msg.general).fadeIn();
                                  })
                                  .always(function () {
                                      t.prop("disabled", !1).val(i).removeClass("omni-application-submit-btn-disabled");
                                  }));
                }),
                "jquery_validation" in omniJobsPublic.vendors && omniJobsPublic.vendors.jquery_validation);
        i &&
            e.each(function () {
                m(this).validate({
                    errorElement: "div",
                    errorClass: "omni-job-form-error",
                    errorPlacement: function (e, t) {
                        e.appendTo(t.parents(".omni-job-form-group"));
                    },
                });
            }),
            e.on("submit", function (e) {
                e.preventDefault();
                var e = m(this),
                    t = !0;
                (t = i ? e.valid() : t) && s.submitApplication(e);
            }),
            0 < m(".omni-application-form .omni-form-file-control").length &&
                void 0 !== (e = navigator.userAgent) &&
                (-1 < e.indexOf("FBAN") || -1 < e.indexOf("FBAV") || -1 < e.indexOf("Instagram")) &&
                m(".omni-application-form .omni-form-file-control").removeAttr("accept");
    }),
    jQuery(function (f) {
        var g = ".omni-job-wrap",
            v = ".omni-job-listings",
            b = ".omni-filter-wrap",
            a = window.location.protocol + "//" + window.location.host + window.location.pathname,
            r = !0;
        function w(e) {
            var s = [],
                i = ["listings", "specs", "search", "lang", "taxonomy", "termId"],
                e = e.data();
            return (
                f.each(e, function (e, t) {
                    -1 === f.inArray(e, i) && s.push({ name: e, value: t });
                }),
                s
            );
        }
        function n(s) {
            var i = s.find(v),
                e = s.find(b + " form"),
                t = e.serializeArray(),
                n = i.data("listings"),
                a = i.data("specs"),
                n = (t.push({ name: "listings_per_page", value: n }), void 0 !== a && t.push({ name: "shortcode_specs", value: a }), w(i));
            0 < n.length && (t = t.concat(n)),
                r &&
                    ((r = !1),
                    f
                        .ajax({
                            url: e.attr("action"),
                            beforeSend: function () {
                                i.addClass("omni-jobs-loading");
                            },
                            data: t,
                            type: e.attr("method"),
                        })
                        .done(function (e) {
                            i.html(e);
                            var t = s.find(".omni-job-search");
                            0 < t.length &&
                                (0 < t.val().length
                                    ? (s.find(".omni-job-search-btn").addClass("omni-job-hide"), s.find(".omni-job-search-close-btn").removeClass("omni-job-hide"))
                                    : s.find(".omni-job-search-btn").removeClass("omni-job-hide")),
                                f(document).trigger("omnijobs_filtered_listings", [s, e]);
                        })
                        .fail(function (e) {})
                        .always(function () {
                            i.removeClass("omni-jobs-loading"), (r = !0);
                        }));
        }
        function y(e) {
            var t = !1;
            return (
                0 < e.length &&
                    e.find(".omni-filter-option").each(function () {
                        0 < f(this).val().length && (t = !0);
                    }),
                t
            );
        }
        function t(e) {
            var t,
                e = e.parents(g),
                s = e.find(".omni-job-search").val();
            e.find(v).data("search", s),
                0 === s.length && e.find(".omni-job-search-icon-wrapper").addClass("omni-job-hide"),
                o(e, "jq", s),
                omniJobsPublic.deep_linking.search && ((t = e.find('input[name="omni_pagination_base"]')), x("jq", s, t.val())),
                n(e);
        }
        0 < f(g).length &&
            f(g).each(function () {
                var e = f(this),
                    t = e.find(b + " form");
                (0 < omniJobsPublic.is_search.length || y(t)) && ((r = !0), n(e));
            });
        function x(e, t, s) {
            s = (s = void 0 !== s ? s : a).split("?")[0];
            var i = new URLSearchParams(document.location.search);
            i.has("paged") && i.delete("paged"), 0 < t.length ? i.set(e, t) : i.delete(e), 0 < (t = i.toString()).length && (t = "?" + t), window.history.replaceState({}, "", s + t);
        }
        function o(e, t, s) {
            var i,
                n,
                a = e.find('input[name="omni_pagination_base"]');
            0 < a.length && ((n = ""), 1 < (i = a.val().split("?")).length && (n = i[1]), (n = new URLSearchParams(n)), 0 < s.length ? n.set(t, s) : n.delete(t), a.val(i[0] + "?" + n.toString()), e.find('input[name="paged"]').val(1));
        }
        function e(e) {
            "selectric" in omniJobsPublic.vendors &&
                omniJobsPublic.vendors.selectric &&
                e.selectric({
                    onInit: function (e, t) {
                        var s = e.id,
                            t = f(t.elements.input);
                        f(e).attr("id", "selectric-" + s), t.attr("id", s);
                    },
                    arrowButtonMarkup: '<span class="omni-selectric-arrow-drop">&#x25be;</span>',
                    customClass: { prefix: "omni-selectric", camelCase: !1 },
                });
        }
        function s() {
            f(".omni-filter-wrap")
                .not(".omni-no-search-filter-wrap")
                .each(function () {
                    var e = f(this);
                    //e.find(".omni-filter-item").first().offset().top < e.find(".omni-filter-item").last().offset().top ? e.addClass("omni-full-width-search-filter-wrap") : e.removeClass("omni-full-width-search-filter-wrap");
                });
        }
        f(b + " .omni-filter-option").on("change", function (e) {
            e.preventDefault();
            var t,
                e = f(this),
                s = e.find("option:selected"),
                i = e.parents(g),
                //e = e.parents(".omni-filter-item").data("filter"),
                s = s.data("slug");
            o(i, e, (s = void 0 !== s ? s : "")), omniJobsPublic.deep_linking.spec && ((t = i.find('input[name="omni_pagination_base"]')), x(e, s, t.val())), n(i);
        }),
            f(b + " .omni-job-search-btn").on("click", function () {
                t(f(this));
            }),
            f(b + " .omni-job-search-close-btn").on("click", function () {
                var e = f(this);
                e.parents(g).find(".omni-job-search").val(""), t(e);
            }),
            f(b + " .omni-job-search").on("keypress", function (e) {
                13 == e.which && (e.preventDefault(), t(f(this)));
            }),
            f(v).on("click", ".omni-jobs-pagination .omni-load-more-btn, .omni-jobs-pagination a.page-numbers", function (e) {
                e.preventDefault();
                var t,
                    s,
                    i,
                    n = f(this),
                    a = n.hasClass("omni-load-more-btn"),
                    e = 1,
                    r = [],
                    o = n.parents(g),
                    l = o.find(v),
                    d = n.parents(".omni-jobs-pagination"),
                    c = l.data("listings"),
                    h = l.data("specs"),
                    m = l.data("lang"),
                    p = l.data("search"),
                    u =
                        (a
                            ? (n.prop("disabled", !0), (e = void 0 === (e = n.data("page")) ? 1 : e))
                            : (n.parents(".page-numbers").find(".page-numbers").removeClass("current").removeAttr("aria-current"), n.addClass("current").attr("aria-current", "page")),
                        d.addClass("omni-jobs-pagination-loading"),
                        o.find(b + " form")),
                    u =
                        (y(u) && (r = u.find(".omni-filter-option").serializeArray()),
                        a ||
                            ((u = ""),
                            1 < (i = (t = n.attr("href")).split("?")).length && ((e = (s = new URLSearchParams(i[1])).get("paged")), s.delete("paged"), 0 < s.toString().length && (u = "?" + s.toString())),
                            (t = i[0] + u),
                            r.push({ name: "omni_pagination_base", value: i[0] + u }),
                            omniJobsPublic.deep_linking.pagination && x("paged", e, t)),
                        omniJobsPublic.is_tax_archive && ((s = l.data("taxonomy")), (i = l.data("termId")), void 0 !== s && void 0 !== i && r.push({ name: "omni_job_spec[" + s + "]", value: i })),
                        r.push({ name: "action", value: "loadmore" }, { name: "paged", value: e }),
                        void 0 !== c && r.push({ name: "listings_per_page", value: c }),
                        void 0 !== h && r.push({ name: "shortcode_specs", value: h }),
                        void 0 !== m && r.push({ name: "lang", value: m }),
                        void 0 !== p && r.push({ name: "jq", value: p }),
                        w(l));
                0 < u.length && (r = r.concat(u)),
                    f
                        .ajax({
                            url: omniJobsPublic.ajaxurl,
                            data: f.param(r),
                            type: "POST",
                            beforeSend: function () {
                                a ? n.text(omniJobsPublic.i18n.loading_text) : l.addClass("omni-jobs-loading");
                            },
                        })
                        .done(function (e) {
                            var t;
                            e
                                ? ((t = d.data("effectDuration")),
                                  d.remove(),
                                  a ? l.append(e) : (l.html(e), l.removeClass("omni-jobs-loading"), void 0 !== t && ((t = isNaN(t) ? t : Number(t)), f("html, body").animate({ scrollTop: o.offset().top - 25 }, t))))
                                : n.remove(),
                                f(document).trigger("omnijobs_load_more", [n, e]);
                        })
                        .fail(function (e) {});
            }),
            e(f(".omni-job-select-control")),
            //e(f(".omni-filter-item select")),
            f(document).on("click", ".omni-filter-toggle", function (e) {
                e.preventDefault();
                e = f(this);
                e.toggleClass("omni-on"), e.hasClass("omni-on") ? e.attr("aria-pressed", "true") : e.attr("aria-pressed", "false"), e.next().slideToggle();
            }),
            0 < f(".omni-filter-wrap").not(".omni-no-search-filter-wrap").length && (s(), f(window).on("resize", s));
    });
