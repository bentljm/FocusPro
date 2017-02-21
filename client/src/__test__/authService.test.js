import AuthService from '../utils/AuthService.js';

describe('AuthService', ()=>{
  beforeAll(() => {
    var localStorageMock = (function() {
      var store = {};
      return {
        getItem: function(key) {
          return store[key];
        },
        setItem: function(key, value) {
          store[key] = value.toString();
        },
        clear: function() {
          store = {};
        }
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    //set up auth service and profile
    var profile = {
      email: 'dummy',
      name: 'dummy'
    };
    window.auth = new AuthService('dummy','dummy');
    window.profile = profile;
  });

  afterEach(() => {
     localStorage.clear();
  });

  it('sets profile on localStorage and emits event on set', ()=>{
    //assert event emitted. order matters
    const spyFn = jest.fn();
    auth.event.on('profile_updated',(newprofile)=>{
      spyFn('profile_update event emitted');
    });
    auth.setProfile(profile);
    expect(localStorage.getItem('profile')).toEqual(JSON.stringify(profile));
    expect(spyFn.mock.calls[0][0]).toBe('profile_update event emitted');
    expect(spyFn.mock.calls.length).toBe(1);
  });

  it('returns profile on get', ()=>{
    // console.log('auth',auth.setProfile);
    localStorage.setItem('profile',JSON.stringify(profile));
    // console.log('window.auth',window.auth.getProfile());
    expect(auth.getProfile()).toEqual(profile);
  });

  it('sets token on localStorage', ()=>{
    auth.setToken('dummy token');
    expect(localStorage.getItem('id_token')).toEqual('dummy token');
  });

  it('gets token on localStorage', ()=>{
    localStorage.setItem('id_token','dummy token');
    expect(auth.getToken()).toEqual('dummy token');
  });
});