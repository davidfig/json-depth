const DEFAULT_OPTIONS = require('./defaults.json')

function indent(options, depth)
{
    let s = ''
    if (depth < options.depth)
    {
        s += chars(options.tab, depth)
    }
    return s
}

function addEntry(entry, options, depth, start)
{
    let s = ''
    if (Array.isArray(entry))
    {
        s += prettifyArray(entry, options, depth, start)
    }
    else
    {
        switch (typeof entry)
        {
            case 'object':
                s += prettifyObject(entry, options, depth, start)
                break

            case 'number':
                s += start + entry
                break

            case 'string':
                s += start + '"' + entry + '"'
                break

            case 'boolean':
                s += start + (entry ? 'true' : 'false')
                break

            case 'null':
                if (!options.ignoreNull)
                {
                    s += start + 'null'
                }
                break

            case 'undefined':
                if (!options.ignoreUndefined)
                {
                    s += start + 'undefined'
                }
        }
    }
    return s
}
function prettifyObject(data, options, depth, start)
{
    const keys = Object.keys(data)
    if (keys.length === 0)
    {
        return start + options.emptyObject
    }
    let s = start + '{' + (depth + 1 < options.depth ? options.eol : (options.spaceInlineObject ? options.spaceAfter : ''))
    for (let i = 0; i < keys.length; i++)
    {
        const key = keys[i]
        const start = indent(options, depth + 1) + '"' + key + '":' + options.spaceAfter
        s += addEntry(data[key], options, depth + 1, start)
        if (i !== keys.length - 1)
        {
            s += ',' + (depth + 1 < options.depth ? options.eol : options.spaceAfter)
        }
    }
    s += (depth + 1 < options.depth ? options.eol + indent(options, depth) : (options.spaceInlineObject ? options.spaceAfter : '')) + '}'
    return s
}

function prettifyArray(data, options, depth, start)
{
    if (data.length === 0)
    {
        return start + options.emptyArray
    }
    let s = start + '[' + (depth + 1 < options.depth ? options.eol : (options.spaceInlineArray ? options.spaceAfter : ''))
    for (let i = 0; i < data.length; i++)
    {
        const start = indent(options, depth + 1)
        s += addEntry(data[i], options, depth + 1, start)
        if (i !== data.length - 1)
        {
            s += ',' + (depth + 1 < options.depth ? options.eol : options.spaceAfter)
        }
    }
    s += (depth + 1 < options.depth ? options.eol + indent(options, depth) : (options.spaceInlineArray ? options.spaceAfter : '')) + ']'
    return s
}

function chars(char, n)
{
    let s = ''
    for (let i = 0; i < n; i++)
    {
        s += char
    }
    return s
}

/**
 * prettify JSON for save with more options
 * @param {object} data
 * @param {object} [options]
 * @param {object} [options.depth=3] the number of depths to expand with options.eol characters
 * @param {string} [options.indent=/t] a string or the number of spaces to indent each depth
 * @param {number} [options.spaces=0] number of spaces to use instead of indent character
 * @param {string} [options.eol=\n] end of line character
 * @param {number} [options.spaceAfter=1] spaces after bracket, squiggly bracket, comma, or colon
 * @param {boolean} [options.ignoreNull=false] ignore null
 * @param {boolean} [options.ignoreUndefined=true] ignore undefined entries
 * @param {string} [options.emptyArray=[]] replace empty array with this string
 * @param {string} [options.emptyObject={}] replace empty object with this string
 * @param {boolean} [options.spaceInlineArray=false] whether to add a space at the beginning and end of an inline array
 * @param {boolean} [options.spaceInlineObject=true] whether to add a space at the beginning and end of an inline object
 */
module.exports = function jsondepth(data, options)
{
    options = options || {}
    for (let opt in DEFAULT_OPTIONS)
    {
        options[opt] = typeof options[opt] === 'undefined' ? DEFAULT_OPTIONS[opt] : options[opt]
    }
    if (options.spaces)
    {
        options.tab = chars(' ', options.spaces)
    }
    options.spaceAfter = chars(' ', options.spaceAfter)
    let s = ''
    if (Array.isArray(data))
    {
        s += prettifyArray(data, options, 0, '')
    }
    else
    {
        s += prettifyObject(data, options, 0, '')
    }
    return s
}