import { useEffect, useRef, useState } from 'react'
import { LogOut, Settings, UserRound } from 'lucide-react'

function Header() {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)
  const adminMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAdminMenuOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !adminMenuRef.current?.contains(event.target)) {
        setIsAdminMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsAdminMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAdminMenuOpen])

  return (
    <header className="header">
      <div>
        <h2>Baku Medical Clinic</h2>
      </div>

      <div className="admin-menu-container" ref={adminMenuRef}>
        <button
          className="user admin-menu-trigger"
          type="button"
          aria-haspopup="true"
          aria-expanded={isAdminMenuOpen}
          aria-label="Open administrator menu"
          onClick={() => setIsAdminMenuOpen((isOpen) => !isOpen)}
        >
          <span className="avatar">A</span>
        </button>

        {isAdminMenuOpen && (
          <div className="admin-menu" role="menu" aria-label="Administrator menu">
            <div className="admin-menu-heading">
              <span className="admin-menu-avatar">A</span>
              <span><strong>Admin</strong><small>admin@clinicflow.az</small></span>
            </div>
            <div className="admin-menu-divider" />
            <div className="admin-menu-clinic">
              <span>Signed in to</span>
              <strong>Baku Medical Clinic</strong>
              <small>Clinic administrator</small>
            </div>
            <div className="admin-menu-divider" />
            <button className="admin-menu-item" type="button" role="menuitem" onClick={() => setIsAdminMenuOpen(false)}>
              <UserRound size={16} aria-hidden="true" /> Account profile
            </button>
            <button className="admin-menu-item" type="button" role="menuitem" onClick={() => setIsAdminMenuOpen(false)}>
              <Settings size={16} aria-hidden="true" /> Admin settings
            </button>
            <div className="admin-menu-divider" />
            <button className="admin-menu-item admin-menu-signout" type="button" role="menuitem" onClick={() => setIsAdminMenuOpen(false)}>
              <LogOut size={16} aria-hidden="true" /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
