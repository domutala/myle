import tippy, { Instance, MultipleTargets, Props } from "tippy.js";
import "tippy.js/animations/scale.css";

declare module "tippy.js" {
  export interface Props {
    hideOnEsc?: boolean;
    className?: string;
  }
}

declare global {
  interface Window {
    __POPPERS__: number[];
  }
}

export default function () {
  if (typeof window !== "undefined") {
    const orig = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (...args) {
      if (
        args[0] === "mousedown" &&
        (args[1] as Function).name === "onDocumentPress"
      ) {
      } else return orig.apply(this, args);
    };
    window.__POPPERS__ = [];
  }

  const popper = function (
    target: MultipleTargets,
    content: HTMLElement,
    options: Partial<Props> = {}
  ) {
    if (typeof window === "undefined") return;

    const hideOnEsc = {
      name: "hideOnEsc",
      defaultValue: true,
      fn({ hide, props, id }: Instance) {
        function onKeyDown(event: KeyboardEvent) {
          const poppers = window.__POPPERS__;
          const is = poppers[poppers.length - 1] === id;
          if (is && props.hideOnEsc && event.key === "Escape") {
            hide();
          }
        }

        return {
          onShow() {
            document.addEventListener("keydown", onKeyDown);
          },
          onHide() {
            document.removeEventListener("keydown", onKeyDown);
          },
        };
      },
    };

    const onCreate = {
      name: "onCreate",
      defaultValue: true,
      fn() {
        return {
          onShow(i: Instance) {
            const poppers = window.__POPPERS__;
            poppers.push(i.id);
          },
          onHide(i: Instance) {
            const poppers = window.__POPPERS__;
            const index = poppers.findIndex((id) => id === i.id);
            if (index !== -1) poppers.splice(index, 1);
          },
        };
      },
    };

    const className = {
      name: "className",
      defaultValue: "",

      fn() {
        return {
          onMount({ popper, props }: Instance) {
            popper.classList.add(props.className || "");
          },
        };
      },
    };

    const onMount = {
      fn(i: Instance) {
        let isShow = false;
        let instance = i;

        function close(event: MouseEvent) {
          if (!isShow) return;
          const poppers = window.__POPPERS__;
          const isEnd = poppers[poppers.length - 1] === instance.id;
          if (!isEnd) return;

          setTimeout(() => {
            const modalContent =
              instance.popper.querySelector(".m-modal-content");

            const popperRect = (
              modalContent || instance.popper
            ).getBoundingClientRect();

            const isIn =
              popperRect.left <= event.clientX &&
              popperRect.right >= event.clientX &&
              popperRect.top <= event.clientY &&
              popperRect.bottom >= event.clientY;
            if (isIn) return;
            i.hide();
          }, 10);
        }

        return {
          onCreate() {
            setTimeout(() => {
              addEventListener("mousedown", close);
            }, 0);
          },
          onShow() {
            isShow = true;
          },
          onHide() {
            isShow = false;
          },
          onDestroy() {
            removeEventListener("mousedown", close);
          },
          onAfterUpdate(i: Instance) {
            instance = i;
          },
        };
      },
    };

    tippy(target, {
      zIndex: 500,
      ...options,
      content: content,
      appendTo: document.querySelector("body") as HTMLElement,
      plugins: [
        ...(options.plugins || []),
        onCreate,
        hideOnEsc,
        className,
        onMount,
      ],
    });
  };

  return popper;
}
