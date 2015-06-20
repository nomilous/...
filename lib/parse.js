module.exports = Parse;
//TODO: syntax error for infusers

function Parse(opts, fn) {
  var f = fn.toString();
  var depth = 0;
  var argbuff = '';
  var infuse = undefined;
  var args = [];
  var arg;
  var last;
  var comment = false;
  var argsNotDone = true;
  var commentType;
  var addArg = function() {
    if (arg == '') return;
    if (argsNotDone) {
      if (last && last.name != arg) {
        args.push(last = {name: arg});
      } else {
        args.push(last = {name: arg});
      }
    }
    argbuff = '';
  }
  for (var i = 0; i < f.length; i++) {
    arg = argbuff.trim();
    switch (f[i]) {
      case '(':
        if (infuse) infuse += f[i];
        depth++;
        break;
      case ',':
        if (infuse) infuse += f[i];
        if (!comment) {
          addArg();
        }
        break;
      case ')':
        if (infuse) infuse += f[i];
        depth--;
        if (depth == 0) {
          addArg();
          argsNotDone = false;
        }
        break;
      case '/':
        if (infuse) infuse += f[i];
        if (f[i+1] == '/') {
          comment = true;
          commentType = '/';
          addArg();
        } else if(f[i+1] == '*') {
          comment = true;
          commentType = '*';
          addArg()
        } else if(f[i-1] == '*') {
          comment = false;
          if (infuse && last) {
            infuse = infuse.trim();
            last.in = infuse.substr(0, infuse.length - 2).trim();
            infuse = undefined;
          }
        }
        break;
      case '\n':
        if (infuse) infuse += f[i];
        if (comment && commentType == '/') {
          comment = false;
          if (infuse && last) {
            last.in = infuse.trim();
            infuse = undefined;
          }
        }
        break;
      case 'i':
        if (comment) {
          if (!infuse) {
            if (f[i+1]+f[i+2] == 'n.') {
              infuse = 'i';
              break;
            }
            else if (f[i+1]+f[i+2] == 'n(') {
              infuse = 'in';
              arg = '';
              for (i = i + 3; i < f.length; i++) {
                if( f[i] == ')') {
                  last = args.filter(function(a) {
                    return a.name == arg
                  })[0];
                  if (typeof last == 'undefined') infuse = undefined;
                  break;
                }
                arg += f[i];
              }
              break;
            }
          }
        }
      default:
        if (depth > 0 && !comment) argbuff += f[i];
        if (infuse) infuse += f[i];
    }
  }
  return args;
}
