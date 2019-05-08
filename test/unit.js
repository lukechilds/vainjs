import test from 'ava';
import vanity from '..';

test('vanity is exported', t => {
	t.not(vanity, undefined);
});
