import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import { storybookDefaults as defaults } from '>/helpers'
import { statusMocks } from '>/statusMocks'

import Signup from './Signup.vue'

const defaultProps = {
  prefillEmail: 'default@example.com',
}

storiesOf('Signup', module)
  .add('empty', () => defaults({
    render: () => h(Signup, {
      ...defaultProps,
      status: statusMocks.default(),
      onSubmit: action('signup'),
    }),
  }))

  .add('pending', () => defaults({
    render: () => h(Signup, {
      ...defaultProps,
      status: statusMocks.pending(),
      onSubmit: action('signup'),
    }),
  }))

  .add('error', () => defaults({
    render: () => h(Signup, {
      ...defaultProps,
      status: statusMocks.validationError('email', 'error message'),
      onSubmit: action('signup'),
    }),
  }))
