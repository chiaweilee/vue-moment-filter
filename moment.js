import moment from 'moment'

export default {
    install: function (Vue, lang) {
        // locale lang
        lang && moment.locale(lang)
        // Vue.use(moment)
        Object.defineProperty(Vue.prototype, 'moment', {value: moment})
        // Vue filter
        // https://github.com/saman/vue-moment-jalaali
        Vue.filter('moment', function () {
            const args = Array.prototype.slice.call(arguments)
            const input = args.shift()
            let date
            if (Array.isArray(input) && typeof input[0] === 'string') {
                // If input is array, assume we're being passed a format pattern to parse against.
                // Format pattern will accept an array of potential formats to parse against.
                // Date string should be at [0], format pattern(s) should be at [1]
                date = moment(input[0], input[1], true)
            } else {
                // Otherwise, throw the input at moment and see what happens...
                date = moment(input)
            }

            if (!date.isValid()) {
                // Log a warning if moment couldn't reconcile the input. Better than throwing an error?
                console.warn('Could not build a valid `moment` object from input.')
                return input
            }

            function parse () {
                const args = Array.prototype.slice.call(arguments)
                const method = args.shift()
                switch (method) {
                    case 'add':
                        // Mutates the original moment by adding time.
                        // http://momentjs.com/docs/#/manipulating/add/
                        const addends = args.shift()
                            .split(',')
                            .map(Function.prototype.call, String.prototype.trim)
                        const objects = {}
                        for (let n = 0; n < addends.length; n++) {
                            const addend = addends[n].split(' ')
                            objects[addend[1]] = addend[0]
                        }
                        date = date.add(objects)
                        break
                    case 'subtract':
                        // Mutates the original moment by subtracting time.
                        // http://momentjs.com/docs/#/manipulating/subtract/
                        const subtrahends = args.shift()
                            .split(',')
                            .map(Function.prototype.call, String.prototype.trim)
                        const obj = {}
                        for (let n = 0; n < subtrahends.length; n++) {
                            const subtrahend = subtrahends[n].split(' ')
                            obj[subtrahend[1]] = subtrahend[0]
                        }
                        date = date.subtract(obj)
                        break
                    case 'from':
                        // Display a moment in relative time, either from now or from a specified date.
                        // http://momentjs.com/docs/#/displaying/fromnow/
                        let from = 'now'
                        if (args[0] === 'now') args.shift()

                        if (moment(args[0]).isValid()) {
                            // If valid, assume it is a date we want the output computed against.
                            from = moment(args.shift())
                        }
                        let removeSuffix = false
                        if (args[0] === true) {
                            args.shift()
                            removeSuffix = true
                        }
                        if (from !== 'now') {
                            date = date.from(from, removeSuffix)
                            break
                        }
                        date = date.fromNow(removeSuffix)
                        break
                    case 'calendar':
                        // Formats a date with different strings depending on how close to a certain date (today by default) the date is.
                        // http://momentjs.com/docs/#/displaying/calendar-time/
                        let referenceTime = moment()
                        if (moment(args[0]).isValid()) {
                            // If valid, assume it is a date we want the output computed against.
                            referenceTime = moment(args.shift())
                        }
                        date = date.calendar(referenceTime)
                        break
                    default:
                        // Format
                        // Formats a date by taking a string of tokens and replacing them with their corresponding values.
                        // http://momentjs.com/docs/#/displaying/format/
                        const format = method
                        date = date.format(format)
                }
                if (args.length) parse.apply(parse, args)
            }
            parse.apply(parse, args)
            return date
        })
    }
}
