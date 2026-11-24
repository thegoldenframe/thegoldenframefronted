import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiPlus, FiMinus, FiShoppingBag, FiCheckCircle } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

const CartDrawer = () => {
  const { items, add, dec, remove, clear, open, setOpen, count, total } = useCart()
  const [table, setTable] = useState('')
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [placed, setPlaced] = useState(null)

  const place = () => {
    if (!table.trim() || !name.trim()) return
    const order = { id: 'GF' + Math.floor(1000 + Math.random() * 9000), items, total, table, name, note, at: new Date().toISOString() }
    try {
      const prev = JSON.parse(localStorage.getItem('gf_orders') || '[]')
      localStorage.setItem('gf_orders', JSON.stringify([order, ...prev].slice(0, 20)))
    } catch {}
    setPlaced(order); clear()
  }
  const close = () => { setOpen(false); setTimeout(() => setPlaced(null), 300) }
  const input = 'w-full bg-white/[0.03] border border-gold/15 focus:border-gold/50 text-ivory placeholder-gray/30 font-body text-xs py-3 px-3 outline-none transition-all'

  return (
    <>
      {count > 0 && !open && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.92 }} onClick={() => setOpen(true)}
          className="fixed bottom-24 right-5 z-[60] btn-gold !rounded-full !px-5 !py-3.5 shadow-gold-lg" aria-label="Open cart">
          <FiShoppingBag /> <span className="text-xs">{count}</span> <span className="text-xs">₹{total}</span>
        </motion.button>
      )}
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm" />
            <motion.aside key="dr" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 32, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[100] w-full max-w-md bg-surface border-l border-gold/15 flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-gold/10">
                <h3 className="font-heading text-2xl text-ivory">{placed ? 'Order Placed' : 'Your Order'}</h3>
                <button onClick={close} className="text-gray hover:text-gold p-1" aria-label="Close"><FiX size={20} /></button>
              </div>

              {placed ? (
                <div className="flex-1 p-8 text-center flex flex-col items-center justify-center">
                  <FiCheckCircle className="text-gold text-5xl mb-5" />
                  <h4 className="font-heading text-3xl text-ivory mb-1">Thank you, {placed.name}!</h4>
                  <p className="font-body text-xs text-gray/60 mb-6">Order <span className="text-gold">#{placed.id}</span> will be served to <span className="text-ivory">{placed.table}</span> in about 15 minutes. Pay at the counter.</p>
                  <button onClick={close} className="btn-gold text-xs py-3 px-8">Continue</button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-8"><p className="font-body text-sm text-gray/50">Your cart is empty. Add something delicious.</p></div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-5 space-y-3">
                    {items.map(i => (
                      <div key={i.id} className="flex items-center gap-3 border border-gold/10 p-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-base text-ivory truncate">{i.name}</p>
                          <p className="font-body text-[11px] text-gold">₹{i.price * i.qty}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => dec(i.id)} className="w-7 h-7 border border-gold/20 text-gold flex items-center justify-center hover:bg-gold/10"><FiMinus size={12} /></button>
                          <span className="font-body text-xs text-ivory w-4 text-center">{i.qty}</span>
                          <button onClick={() => add(i)} className="w-7 h-7 border border-gold/20 text-gold flex items-center justify-center hover:bg-gold/10"><FiPlus size={12} /></button>
                        </div>
                        <button onClick={() => remove(i.id)} className="text-gray/40 hover:text-red-400" aria-label="Remove"><FiX size={14} /></button>
                      </div>
                    ))}
                    <div className="space-y-3 pt-3">
                      <input className={input} placeholder="Your name *" value={name} onChange={e => setName(e.target.value)} />
                      <input className={input} placeholder="Table / Station (e.g. Snooker 2, PS5 Duo) *" value={table} onChange={e => setTable(e.target.value)} />
                      <textarea rows={2} className={input + ' resize-none'} placeholder="Notes (less spicy, no ice…)" value={note} onChange={e => setNote(e.target.value)} />
                    </div>
                  </div>
                  <div className="p-5 border-t border-gold/10">
                    <div className="flex justify-between mb-4"><span className="font-body text-xs text-gray/60 uppercase tracking-widest">Total</span><span className="font-heading text-2xl text-gold">₹{total}</span></div>
                    <button onClick={place} disabled={!table.trim() || !name.trim()} className="btn-gold w-full py-4 text-xs disabled:opacity-40 disabled:cursor-not-allowed">Place Order</button>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
export default CartDrawer
