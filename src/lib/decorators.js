import validator from 'validator'

export function isEmpty (field) {
  function capitalize (value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  return function (target, key, descriptor) {
    const message = `${field} cannot be empty`
    const origFn = descriptor.value.bind(target)

    descriptor.value = function(args, context) {
      const validated = args.data[field]
      if (validator.isEmpty(validated)) return new Error(capitalize(message))
      else return origFn(args, context)
    }
  }
}