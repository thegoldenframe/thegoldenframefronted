export const EMOJI = { 'Crispy Nachos':'🌮','Loaded Fries':'🍟','Chicken Wings (6 pc)':'🍗','Paneer Tikka':'🧀','Cheese Garlic Bread':'🥖','Veg Spring Rolls':'🥟','Chicken Popcorn':'🍤','Classic Club Burger':'🍔','Paneer Wrap':'🌯','Chicken Caesar Wrap':'🌯','Margherita Pizza':'🍕','Peri-Peri Pasta':'🍝','Grilled Chicken Bowl':'🥗','Cold Coffee':'🧋','Fresh Lime Soda':'🍋','Mango Smoothie':'🥭','Mint Lemonade':'🍹','Virgin Mojito':'🍸','Masala Chai':'🍵','Red Bull':'⚡','Brownie Blast':'🍫','Gulab Jamun (2 pc)':'🍡','Chocolate Mousse':'🍮' }
export const TONE = { snacks: 'from-amber-500/25', food: 'from-rose-500/25', beverages: 'from-sky-500/25', desserts: 'from-fuchsia-500/25' }

/** "Chicken Wings (6 pc)" → "chicken-wings-6-pc" */
export const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
export const photoUrl = (item) => `/images/menu/${slugify(item.name)}.jpg`

/** Which 3D model to show for a menu item */
export function foodKind(item) {
  const n = item.name.toLowerCase()
  if (/chai|tea\b|espresso|latte|cappuccino/.test(n)) return 'cup'
  if (/burger|wrap|bowl|sandwich/.test(n)) return 'burger'
  if (/pizza|pasta|garlic bread/.test(n)) return 'pizza'
  if (/fries|nachos|wings|popcorn|tikka|roll/.test(n)) return 'fries'
  if (/brownie|jamun|mousse|cake|ice cream/.test(n)) return 'dessert'
  if (item.category === 'beverages' || /soda|lemonade|mojito|smoothie|red bull|coffee|juice|shake/.test(n)) return 'glass'
  if (item.category === 'desserts') return 'dessert'
  return 'burger'
}
export function drinkColor(name) {
  const n = name.toLowerCase()
  if (/coffee/.test(n)) return '#8b5a3c'
  if (/lime/.test(n)) return '#c4ec6a'
  if (/mango/.test(n)) return '#ffb52e'
  if (/mojito/.test(n)) return '#a6e6a8'
  if (/lemonade/.test(n)) return '#f1ea8a'
  return '#f4d03f'
}
