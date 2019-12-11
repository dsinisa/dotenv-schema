# dotenv-schema

extend dotenv to support defaults, types and structure

don't limit your application configuration only to strings!

Note that this module does not modify process.env in any way. It parses process.env and then returns an object that reflects the provided schema. You should call to dotenv.config() to load .env file


## Example

```javascript

configSchemaTest = {
  test1: 'aaa', // simple string value. if there is TEST1 environment variable, it will get that value instead
  test2: 1, // Numbers are parsed from .env
  test3: 1.3, // Floats are parsed too
  test4: false, // if env.TEST4 is 1,true,on... this will be true
  test5: String, // specify type without default value
  test6: Number,
  test7: Boolean,
  test8: Date,
  test9: {
    type: String, // specify type
    default: 'abc', // default value if not found in .env
  },
  test10: {
    type: Number, // specify type
    value: 1, // specify value if not found in .env
  },
  test11: {
    type: String,
    // required: true, // will throw error if env.TEST11 is not defined
  },
  test12: {
    envName: 'OTHER_NAME', // will read value from env.OTHER_NAME instead of TEST12
  },
  nested: { // keys can be nested
    test13: String, // this will evaluate from 'NESTED_TEST13'
    more: {
      test13: { type: Boolean } // = NESTED_MORE_TEST13
    },
  },
  camelCaseConversion: 1, // this will convert to environment variable 'CAMEL_CASE_CONVERSION',
};

const myAppConfig = require('dotenv-schema').config(configSchemaTest);

console.log(myAppConfig);
/*
{ test1: 'aaa',
  test2: 1,
  test3: 1.3,
  test4: false,
  test5: '',
  test6: '',
  test7: false,
  test8:
   'Wed Dec 11 2019 12:31:46 GMT+0100 (Central European Standard Time)',
  test9: 'abc',
  test10: 1,
  test11: '',
  test12: '',
  nested: { test13: '', more: { test13: '' } },
  camelCaseConversion: 1 }
*/

```

##### dumpConfig

```javascript
// dumpConfig does the reverse: it returns all lines with all of the keys defined in schema like .env file would look like
// this is useful for generating .env files

console.log(require('dotenv-schema').config(configSchemaTest));
/*
TEST1=aaa
TEST2=1
TEST3=1.3
TEST4=false
TEST5=
TEST6=
TEST7=false
TEST8=Wed Dec 11 2019 12:42:50 GMT+0100 (Central European Standard Time)
TEST9=abc
TEST10=1
TEST11=
OTHER_NAME=
NESTED_TEST13=
NESTED_MORE_TEST13=
CAMEL_CASE_CONVERSION=1
*/

```


