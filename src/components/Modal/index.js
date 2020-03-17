import React, { useEffect, useCallback } from 'react';
import './modal.css';

export default function Modal({
  onOk,
  width = 700,
  title,
  children,
  onCancel,
  isVisible,
  renderFooter,
  isRenderHeader = true,
  isRenderCloseIcon,
}) {

  const _onCancel = useCallback(
    () => {
      if (onCancel && typeof onCancel === 'function') {
        onCancel();
      }
    },
    [onCancel]
  )
  const _onOk = useCallback(
    () => {
      if (onOk && typeof onOk === 'function') {
        onOk()
      }
    },
    [onOk]
  )

  useEffect(() => {
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 27 && isVisible) {
        _onCancel()
      }
    })
    return () => {
      document.removeEventListener('keyup', () => { });
    }
  }, [isVisible, _onCancel])

  useEffect(() => {
    if (isVisible) {
      // Modal Open -> Them class vao cho body
      document.querySelector("body").classList.add("tcl-modal-open");
    } else {
      // Modal Close -> Remove class vao body
      document.querySelector("body").classList.remove("tcl-modal-open");
    }
  }, [isVisible])

  const _renderFooter = () => {
    if (renderFooter && typeof renderFooter === 'function') {
      return renderFooter();
    }
    return (
      <>
        <button onClick={_onCancel}>Cancel</button>
        <button onClick={_onOk}>Ok</button>
      </>
    )
  }
  // Mỗi lần Component update (DidUpdate)
  // 1. Bên class chỉ đơn giản là gọi lại hàm render -> Không phải là khởi tạo lại class
  // 2. Bêns function gọi lại nguyên function này luôn

  return (
    // Template string -> ES6
    <div className={`tcl-modal-wrapper ${isVisible ? 'show' : ''}`}>
      <div className="tcl-mask" onClick={_onCancel}></div>
      <div className="tcl-dialog">
        <div className="tcl-modal-content" style={{ width }}>
          {
            isRenderHeader &&
            <div className="tcl-modal-header">
              <h3>{title}</h3>
              {
                isRenderCloseIcon &&
                <i onClick={_onCancel}
                  className="tcl-modal-close ion-close-round"></i>
              }
            </div>

          }
          <div className="tcl-modal-body">{children}</div>

          <div className="tcl-modal-footer">
            {_renderFooter()}
          </div>
        </div>
      </div>
    </div>
  )
}
