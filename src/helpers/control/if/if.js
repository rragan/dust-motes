(function (dust) {

  dust.helpers['if'] =
    function (chunk, context, bodies, params) {
    var body = bodies.block,
      result,
      test,
      skip = bodies['else'];

    if (params) {
      if (params.test) {
        test = params.test;
        if (typeof test !== 'string') {
          test = dust.helpers.tap(params.test, chunk, context);
        }
        var tokens = tokenize(test);
        try {
          result = evaluate(tokens, test, context);
        } catch (e) {
          _console.log("Error:" + e);
          return chunk;
        }
      } else if (params.cond) {
        var cond = dust.helpers.tap(params.cond, chunk, context);
        /*jshint evil:true */
        result = eval(cond);
      }
      // eval expressions with given dust references
      if (result) {
        if (body) {
          return chunk.render(bodies.block, context);
        } else {
          _console.log("Missing body block in the if helper!");
          return chunk;
        }
      }
      if (skip) {
        return chunk.render(bodies['else'], context);
      }
    }
    // no condition
    else {
      _console.log("No condition given in the if helper!");
    }
    return chunk;
  };


  var regexHex = new RegExp('[0-9A-Fa-f]');

  // Token types
  var STR = 0,
    NUM = 1,
    OP = 2,
    NAME = 3,
    ERR = 4,
    END = 5;

  // Operator and grouping symbols
  var OROP = 0,
    ANDOP = 1,
    EQOP = 2,
    NEOP = 3,
    LTOP = 4,
    GTOP = 5,
    LEOP = 6,
    GEOP = 7,
    NOTOP = 8,
    LPARENOP = 9,
    RPARENOP = 10,
    LBRACKOP = 11,
    RBRACKOP = 12,
    ENDOP = 13;

  // Lookup table for operator number to string
  var OPS = ['||', '&&', '==', '!=', '<', '>', '<=', '>=', '!', '(', ')', '[', ']', 'end'];
  var actions = [or, and, eq, ne, lt, gt, le, ge, not];

  // Tokenizer symbols of interest
  var SPACE = 0x20,
    TAB = 0x09,
    EXCLAIM = 0x21,
    QUOTE = 0x22,
    DOLLAR = 0x24,
    AND = 0x26,
    APOS = 0x27,
    LPAREN = 0x28,
    RPAREN = 0x29,
    PLUS = 0x2b,
    MINUS = 0x2d,
    DOT = 0x2e,
    ZERO = 0x30,
    NINE = 0x39,
    LT = 0x3c,
    EQ = 0x3d,
    GT = 0x3e,
    A = 0x41,
    E = 0x45,
    X = 0x58,
    Z = 0x5a,
    LBRACK = 0x5b,
    BACKSLASH = 0x5c,
    RBRACK = 0x5d,
    USCORE = 0x5f,
    a = 0x61,
    e = 0x65,
    x = 0x78,
    z = 0x7a,
    OR = 0x7c;

  // Storage for a simple cache to hold the last TOK_CACHE_SIZE tokenized expressions.
  var TOK_CACHE_SIZE = 8; // Should be power of 2
  var tokCache = {};
  var tokCacheList = new Array(TOK_CACHE_SIZE),
    nextTokCacheEntry = 0;

  /*
   *  tokenize - Converts an input string to a tokenized expression form.
   *  @param input - String of expression
   *  @param d - Second character code.
   *  Returns - array of tokens
   */
  function tokenize(input) {
    'use strict';

    // Previous Op-Current Op allowed table
    var pocoOk = {
      "((": 1,
      "))": 1,
      "!!": 1,
      "<!": 1,
      ">!": 1,
      ">=!": 1,
      "<=!": 1,
      "==!": 1,
      "!=!": 1,
      "&&!": 1,
      "||!": 1,
      "]&&": 1,
      "]||": 1,
      "]>": 1,
      "]<": 1,
      "]<=": 1,
      "]>=": 1,
      "]==": 1,
      "]!=": 1,
      "].": 1,
      "[(": 1,
      "])": 1,
      ")&&": 1,
      ")||": 1,
      ")>": 1,
      ")<": 1,
      ")<=": 1,
      ")>=": 1,
      ")==": 1,
      ")!=": 1,
      ")!": 1,
      ")]": 1,
      "]]": 1,
      "&&(": 1,
      "||(": 1,
      ">'": 1,
      "<(": 1,
      "<=(": 1,
      ">=(": 1,
      "==(": 1,
      "!=(": 1,
      "!(": 1
    };

    var tokens = [],
      pos = 0,
      c, cc, posStart, chr, type, result, poco, po, num;

    if (tokCache[input]) {
      return tokCache[input];
    }

    while (pos < input.length) {
      posStart = pos;
      chr = input[pos];
      cc = input.charCodeAt(pos);

      // Handle whitespace
      if (cc === SPACE || cc === TAB) {
        pos++;
        // Handle character strings
      } else if (cc === QUOTE || cc === APOS) {
        type = STR;
        c = chr;
        // keep moving forward till the matching quote is found. if current char is a backslash, move one extra forward
        pos++;
        while (pos < input.length) {
          if (input.charCodeAt(pos) === BACKSLASH) {
            pos++;
          }
          c += input[pos];
          if (input.charCodeAt(pos) === cc) {
            break;
          }
          pos++;
        }
        if (c.charCodeAt(c.length - 1) !== cc) {
          type = ERR;
          c = '"Unclosed string constant"';
        }
        pushToken(tokens, type, c.slice(1, c.length - 1));
        pos++;
        // Handle numbers, decimal and hex
      } else if ((cc >= ZERO && cc <= NINE) || cc === MINUS || (cc === DOT && input.charCodeAt(pos + 1) >= ZERO && input.charCodeAt(pos + 1) <= NINE)) {
        // type = INT;
        if (cc === ZERO && input.charCodeAt(pos + 1) === x || input.charCodeAt(pos + 1) === X) {
          // hex can not contain dots or exponents
          while (++pos < input.length && regexHex.test(input[pos + 1])) {}
          num = parseInt(input.slice(posStart, pos + 1), 16);
          pushToken(tokens, NUM, num);
        } else {
          if (cc !== DOT) { // first do integer part
            pos = collectDigits(input, pos);
            if (input.charCodeAt(pos + 1) === DOT) {
              pos += 1; // skip dot. its not important
            }
          } else {
            if (input.charCodeAt(pos + 1) === DOT) {
              pushToken(tokens, ERR, 'Consecutive periods invalid' + input);
              break;
            }
          }
          // decimal part
          pos = collectDigits(input, pos);
          // exponent part
          if (input.charCodeAt(pos + 1) === e || input.charCodeAt(pos + 1) === E) {
            pos = collectExponent(input, pos);
          }
          num = parseFloat(input.slice(posStart, pos + 1));
          pushToken(tokens, NUM, num);
        }
        pos++;
        // Handle operators and names
      } else {
        if (input.charCodeAt(pos) === DOT) {
          pushToken(tokens, DOT, '.');
          pos++;
          continue;
        }
        result = testOperator(input.charCodeAt(pos), input.charCodeAt(pos + 1));
        if (result) {
          type = OP;
          pos = pos + result[1];
          // Form previous operator (po), current operator (co) pair to check that these operators can be adjacent
          poco = '';
          if (tokens.length > 0) {
            po = tokens[tokens.length - 1];
            if (po.type === OP) {
              poco = OPS[po.value] + OPS[result[0]];
              if (!pocoOk[poco]) {
                result[0] = "Invalid expression, consecutive operators " + poco + " in " + input;
                result[2] = 0;
                type = ERR;
              }
            }
          }
          // Push type=op, xxxOP, priority
          pushToken(tokens, type, result[0], result[2]);
        } else {
          // Assume it is an name or path part
          c = '';
          while (pos < input.length) {
            if (isNameChar(input.charCodeAt(pos))) {
              c = c + input[pos++];
            } else {
              pos--;
              break; // end of match.
            }
          }
          if (c.length) {
            pushToken(tokens, NAME, c);
            pos++;
          } else {
            pushToken(tokens, ERR, 'Invalid Expression near ' + input[pos] + input[pos + 1]);
            return tokens;
          }
        }
      }
    }
    var lastTok = tokens[tokens.length - 1];
    if (lastTok.type === OP && lastTok.value !== RPARENOP && lastTok.value !== RBRACKOP) {
      pushToken(tokens, ERR, 'Invalid expression, ended with an operator:' + input);
    }

    // Manage a simple cache to hold the last TOK_CACHE_SIZE tokenized expressions
    // to avoid re-tokenizing if reused frequently.  Each new tokenized entry discards
    // the oldest one from the list. LRU might be better but more complex. This will
    // handle loops with a few tests in them just fine. 
    if (!tokCache[input]) {
      tokCacheList[nextTokCacheEntry] = input;
      tokCache[input] = tokens;
      nextTokCacheEntry = (nextTokCacheEntry + 1) % TOK_CACHE_SIZE;
      if (tokCacheList[nextTokCacheEntry]) {
        delete tokCache[tokCacheList[nextTokCacheEntry]];
      }
    }
    return tokens;
  }

  function pushToken(tokens, type, value, priority) {
    'use strict';
    tokens.push({
      type: type,
      value: value,
      priority: priority
    });
  }

  /*
   *  isNameChar - Returns true if c is a valid character in a name.
   * Note that this is overly restrictive with respect to what JavaScript
   * will accept as a name but is faster than checking for all Unicode
   * values allowed in names.
   *  @param c - charCodeAt value of character
   *
   *  Returns - true if name character and false otherwise
   */
  function isNameChar(c) {
    'use strict';

    if (c >= a && c <= z) {
      return true;
    }
    if (c >= A && c <= Z) {
      return true;
    }
    if (c >= ZERO && c <= NINE) {
      return true;
    }
    if (c === USCORE) {
      return true;
    }
    if (c === DOLLAR) {
      return true;
    }
  }

  /*
   *  testOperator - Given two consecutive charCodeAt values, detemine if they are an operator
   *  @param c - First character code.
   *  @param d - Second character code.
   *
   *  Using charCodeAt and integer tests everywhere cuts time almost in half
   *  over using regex and string compares/
   *  Returns - array [operatorCode, operator length, priority] or undefined
   */
  function testOperator(c, d) {
    'use strict';

    if (c === EQ && d === EQ) {
      return [EQOP, 2, 30];
    }
    if (c === EXCLAIM) {
      if (d === EQ) {
        return [NEOP, 2, 30];
      }
      return [NOTOP, 1, 50];
    }
    if (c === LT) {
      if (d === EQ) {
        return [LEOP, 2, 40];
      }
      return [LTOP, 1, 40];
    }
    if (c === GT) {
      if (d === EQ) {
        return [GEOP, 2, 40];
      }
      return [GTOP, 1, 40];
    }

    if (c === AND && d === AND) {
      return [ANDOP, 2, 20];
    }
    if (c === OR && d === OR) {
      return [OROP, 2, 10];
    }

    if (c === LBRACK) {
      return [LBRACKOP, 1, 5];
    }
    if (c === RBRACK) {
      return [RBRACKOP, 1, 0];
    }
    if (c === LPAREN) {
      return [LPARENOP, 1, 5];
    }
    if (c === RPAREN) {
      return [RPARENOP, 1, 0];
    }
  }

  // Startng at pos +1, advance pos until non-digit is found. 
  // pos is returned pointing to last digit.
  function collectDigits(input, pos) {
    'use strict';
    while (pos < input.length && input.charCodeAt(pos + 1) >= ZERO && input.charCodeAt(pos + 1) <= NINE) {
      pos += 1;
    }
    return pos;
  }

  function collectExponent(input, pos) {
    'use strict';
    // optional prefix, may also be (a useless) plus sign
    if (input.charCodeAt(++pos + 1) === PLUS || input.charCodeAt(pos + 1) === MINUS) {
      pos += 1;
    }
    pos = collectDigits(input, pos);
    return pos;
  }

  /*
   *  evaluate - Interpret the token string to get a result
   *  @param toks - token string from tokenize
   *  @param expr - string form of the expression
   *  @param ctx - dust context for obtaining values for names and paths
   *
   *  Returns - value of the expression
   */
  function evaluate(toks, expr, ctx) {
    'use strict';

    var opstk = [],
      opndstk = [],
      nameParts = [],
      tok,
      i = 0;

    // Main loop of expression interpreter
    while (i < toks.length) {
      tok = toks[i];

      // Collect name or path, get value from context and stack it
      if (tok.type === NAME || (tok.type === DOT)) {
        i = collectName(toks, i, ctx, expr, nameParts);
        opndstk.push(getPathValue(nameParts, ctx));
        nameParts.length = 0;
        continue;
      }
      i++;
      if (tok.type === OP) {
        evalOperator(opstk, opndstk, tok, ctx);
      } else if (tok.type === NUM) {
        opndstk.push(tok.value);
      } else if (tok.type === STR) {
        opndstk.push(tok.value);
      } else if (tok.type === ERR) {
        opstk.length = 0;
        opndstk.length = 0;
        throw tok.value;
      }
    }

    // Process the residue, if any, on the operator/operand stacks
    while (opstk.length > 0) {
      tok = opstk[opstk.length - 1];
      // Diagnose leftover operator with no operands
      if (opstk.length >= 1 && opndstk.length === 0) {
        throw 'Invalid expression - too few operands:' + expr;
      }
      if (tok.value === RPARENOP || tok.value === LPARENOP) {
        // if (tok.value === ')' || tok.value === '(') {
        throw 'Unbalanced parentheses: ' + expr;
      }
      if (tok.value === RBRACKOP || tok.value === LBRACKOP) {
        throw 'Unbalanced brackets:' + expr;
      }

      // Flush the remaining operator/operands by sending a special end operator
      evalOperator(opstk, opndstk, {
        type: END,
        value: ENDOP,
        priority: -9999
      }, ctx);
    }
    if (opndstk.length > 1) {
      throw "Invalid expression - excess operands:" + expr;
    }
    return opndstk.pop();
  }

  /*
   *  collectName - Given the token stream and a starting postion i, collect a name or path.
   *  @param toks - The list of tokens.
   *  @param i - The starting position of a name part. Can be a leading period.
   *  @param ctx - The dust context holding values.
   *  @param expr - Text of the expression for diagnostic use.
   *  @param nameParts - Array for collecting the parts of the name
   *  Returns - new value of i after the end of the scanned name
   */
  function collectName(toks, i, ctx, expr, nameParts) {
    'use strict';

    var tok, lastTokenDot;
    // Mark name as anchored path
    if (toks[i].type === DOT) {
      nameParts.push('');
      // nameParts.push(toks[i].value);
      i++;
      lastTokenDot = true;
    }
    while (i < toks.length) {
      tok = toks[i];
      i++;
      if (tok.type === NAME) {
        nameParts.push(tok.value);
        lastTokenDot = false;
      } else if (tok.type === DOT) {
        if (lastTokenDot) {
          throw 'Consecutive dots in paths are invalid' + expr;
        }
        lastTokenDot = true;
      } else if (tok.type === OP && tok.value === LBRACKOP) {
        i = evaluateSubscript(toks, i, expr, ctx, nameParts);
        lastTokenDot = false;
      } else {
        if (lastTokenDot && nameParts.length > 1) {
          throw 'Path ending with . is invalid - ' + expr;
        }
        return i - 1; // end of name part -- hit something else
      }
    }
    if (lastTokenDot) {
      throw 'Path ending with . is invalid: ' + expr;
    }
    return i;
  }

  /*
   *  evaluateSubscript - Compute the value of a subscript part of path
   *  @param toks - token list
   *  @param i - position of subscript start in the token list
   *  @param expr - string form of the overall expression
   *  @param ctx - dust context for obtaining values for names and paths
   *
   *  Returns - updated position for i after processing the subscript
   */
  function evaluateSubscript(toks, i, expr, ctx, nameParts) {
    'use strict';

    var bracketCount = 1,
      endPos = i,
      subVal;

    while (endPos++) {
      if (endPos >= toks.length) {
        throw 'Unbalanced subscript brackets:' + expr;
      } else if (toks[endPos].value === LBRACKOP) {
        bracketCount++;
      } else if (toks[endPos].value === RBRACKOP) {
        bracketCount--;
      }
      if (bracketCount === 0) {
        subVal = evaluate(toks.slice(i, endPos), expr, ctx);
        nameParts.push(subVal);
        return endPos + 1;
      }
    }
  }

  // Called when we have operator token. 
  /*
   *  evalOperator - Evaluates the operator passed in tok.
   *  Will either evaluate the operator consuming its operands
   *  or push it for later if it's priority requires.
   *
   *  @param opstk - operator stack holding unprocessed operators
   *  @param opndstk - operand stack holding unprocessed operands
   *  @param tok - token holding the operator to process
   *
   */
  function evalOperator(opstk, opndstk, tok) {
    'use strict';

    var top, op, action, leftVal, rightVal, priority;

    priority = tok.priority;
    // Check priorities if there are ops on the stack
    if (opstk.length > 0) {

      // Just push open paren, bracket and unary !
      if (tok.value === LPARENOP || tok.value === LBRACKOP || tok.value === NOTOP) {
        opstk.push(tok);
        return;
      }
      top = opstk[opstk.length - 1];
      // Priority <= top of op stack. Evaluate with it's operands and push result
      while (top && priority <= top.priority) {

        if (tok.value === RPARENOP && top.value === LPARENOP) {
          opstk.pop(); // remove opening paren from op stack
          return; // parens matched. All done
        }
        action = actions[top.value];
        if (!action) {
          throw 'Invalid expression format';
        }

        //if (priority <= ops[top.value]) {
        op = opstk.pop(); // discard as just evaluated
        top = opstk[opstk.length - 1];
        rightVal = opndstk.pop();
        // if unary operator, only pop one operand
        if (op.value === NOTOP) {
          leftVal = rightVal;
        } else {
          leftVal = opndstk.pop();
        }
        opndstk.push(action(leftVal, rightVal));
      }
    }
    if (tok.type !== END) {
      opstk.push(tok);
    }
  }

  /*
   *  getPathValue - Given a name or path, return the value from the context.
   *  @param path - Array of names and values describing the path. May have
   *                a leading period if the path search is anchored.
   *  Return - value from the context based on the path.
   */
  function getPathValue(path, ctx) {
    'use strict';

    if (path.length === 1 && path[0].length !== 0) {
      return ctx.get(path[0]);
    }
    // anchor = false;
    if (path[0].length === 0) {
      return ctx.getPath(true, path.slice(1));
    }
    return ctx.getPath(false, path);
  }

  // Operator functions for evaluations

  function lt(a, b) {
    return a < b;
  }

  function gt(a, b) {
    return a > b;
  }

  function le(a, b) {
    return a <= b;
  }

  function ge(a, b) {
    return a >= b;
  }

  function eq(a, b) {
    return a === b;
  }

  function ne(a, b) {
    return a !== b;
  }

  function and(a, b) {
    return a && b;
  }

  function or(a, b) {
    return a || b;
  }

  function not(a) {
    return !a;
  }



})(typeof exports !== 'undefined' ? module.exports = require('dustjs-linkedin') : dust);
