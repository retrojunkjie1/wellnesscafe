// src/schemas/assistantSchema.js
// Minimal runtime sanitizer for Assistant documents stored in Firestore.
// Keep fields predictable for filters: state, city, insurance[], gender[], cost, verified, tags[]

/**
 * @typedef {Object} AssistantDoc
 * @property {('housing'|'legal'|'funding'|'sobriety')} type
 * @property {string} name
 * @property {string} [source]
 * @property {boolean} [verified]
 * @property {{phone?:string,email?:string,url?:string}} [contact]
 * @property {boolean} [applyOnline]
 * @property {string} [applicationUrl]
 * @property {string} [description]
 * @property {{street?:string, city?:string, state?:string, zip?:string}} [address]
 * @property {string[]} [insurance]
 * @property {string[]} [gender]
 * @property {string} [cost]
 * @property {string[]} [tags]
 * @property {string} [city]
 * @property {string} [state]
 */

const toStr = (v)=> (typeof v === 'string' ? v.trim() : '');
const toArr = (v)=> Array.isArray(v) ? v.map(String).map((s)=>s.trim()).filter(Boolean)
  : typeof v === 'string' ? v.split(/[|/,;]+/).map((s)=>s.trim()).filter(Boolean) : [];

export const sanitizeAssistant = (input)=>{
  const out = {
    type: ['housing','legal','funding','sobriety'].includes(input?.type) ? input.type : 'sobriety',
    name: toStr(input?.name),
    source: toStr(input?.source),
    verified: Boolean(input?.verified),
    contact: {
      phone: toStr(input?.contact?.phone),
      email: toStr(input?.contact?.email),
      url: toStr(input?.contact?.url || input?.contact?.website),
    },
    applyOnline: Boolean(input?.applyOnline),
    applicationUrl: toStr(input?.applicationUrl),
    description: toStr(input?.description),
    address: {
      street: toStr(input?.address?.street || input?.street),
      city: toStr(input?.address?.city || input?.city),
      state: toStr(input?.address?.state || input?.state),
      zip: toStr(input?.address?.zip || input?.zip),
    },
    insurance: toArr(input?.insurance || input?.insuranceTypes),
    gender: toArr(input?.gender || input?.gendersServed),
    cost: toStr(input?.cost),
    tags: toArr(input?.tags || input?.categories),
  };
  // denormalized for faster filters
  out.city = out.address.city;
  out.state = out.address.state;
  return out;
};

/** Map an incoming provider object (from SAMHSA/OpenReferral/etc.) into AssistantDoc */
export const normalizeProvider = (raw, defaults={})=>{
  return sanitizeAssistant({
    type: defaults.type || 'sobriety',
    name: raw.name || raw.program_name || raw.title,
    source: defaults.source || raw.source || 'external',
    verified: Boolean(raw.verified || raw.is_verified),
    contact: {
      phone: raw.phone || raw.contact_phone,
      email: raw.email || raw.contact_email,
      url: raw.website || raw.url,
    },
    applyOnline: Boolean(raw.applyOnline || raw.has_application || raw.application_url),
    applicationUrl: raw.application_url || raw.apply_link,
    description: raw.description || raw.summary || '',
    address: {
      street: raw.street || raw.address1 || raw.address,
      city: raw.city,
      state: raw.state || raw.state_code,
      zip: raw.zip || raw.postal_code,
    },
    insurance: raw.insurance || raw.insurance_types,
    gender: raw.gender || raw.genders_served,
    cost: raw.cost || raw.fee || raw.payment_options,
    tags: raw.tags || raw.categories,
  });
};

export default sanitizeAssistant;
