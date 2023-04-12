import { Types } from '../Core/Types'
import { NavigationPresenter } from './NavigationPresenter'
import { Router } from '../Routing/Router'
import { AppTestHarness } from '../TestTools/AppTestHarness'
import { GetSuccessfulRegistrationStub } from '../TestTools/GetSuccessfulRegistrationStub'
import { SingleBookResultStub } from '../TestTools/SingleBookResultStub'
import { SingleAuthorsResultStub } from '../TestTools/SingleAuthorsResultStub'

let appTestHarness = null
let navigationPresenter = null
let router = null
let dataGateway = null
let dynamicBookNamesStack = null

describe('navigation', () => {
  beforeEach(async () => {
    appTestHarness = new AppTestHarness()
    appTestHarness.init()
    appTestHarness.bootStrap(() => {})
    navigationPresenter = appTestHarness.container.get(NavigationPresenter)
    router = appTestHarness.container.get(Router)
    dataGateway = appTestHarness.container.get(Types.IDataGateway)
    dynamicBookNamesStack = ['book7', 'book6', 'book5', 'book4', 'book3', 'book2', 'book1']
  })

  describe('before login', () => {
    it('anchor default state', () => {
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('')
      expect(navigationPresenter.viewModel.showBack).toBe(false)
      expect(navigationPresenter.viewModel.menuItems).toEqual([])
    })
  })

  describe('login', () => {
    beforeEach(async () => {
      await appTestHarness.setupLogin(GetSuccessfulRegistrationStub, 'login')
    })
    it('should navigate down the navigation tree', () => {
      dataGateway.get.mockImplementation((path) => {
        console.log('*** /authors pathD =', path)
        if (path.indexOf('/authors') !== -1) {
          return Promise.resolve(SingleAuthorsResultStub())
        } else if (path.indexOf('/book?emailOwnerId=a@b.com&bookId=') !== -1) {
          return Promise.resolve(SingleBookResultStub(dynamicBookNamesStack.pop()))
        }
      })

      // drill down one
      router.goToId('authorsLink')

      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Authors > authorsLink')
      expect(navigationPresenter.viewModel.showBack).toBe(true)
      expect(navigationPresenter.viewModel.menuItems).toEqual([
        {
          id: 'authorsLink-authorPolicyLink',
          visibleName: 'Author Policy'
        },
        {
          id: 'authorsLink-mapLink',
          visibleName: 'View Map'
        }
      ])

      // drill down two
      router.goToId('authorsLink-authorPolicyLink')

      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe(
        'Author Policy > authorsLink-authorPolicyLink'
      )
      expect(navigationPresenter.viewModel.showBack).toBe(true)
      expect(navigationPresenter.viewModel.menuItems).toEqual([])
    })

    it('should move back twice', () => {
      dataGateway.get.mockImplementation((path) => {
        console.log('*** /authors pathD =', path)
        if (path.indexOf('/authors') !== -1) {
          return Promise.resolve(SingleAuthorsResultStub())
        } else if (path.indexOf('/book?emailOwnerId=a@b.com&bookId=') !== -1) {
          return Promise.resolve(SingleBookResultStub(dynamicBookNamesStack.pop()))
        }
      })

      // drill down one
      router.goToId('authorsLink')
      // drill down two
      router.goToId('authorsLink-authorPolicyLink')

      navigationPresenter.back()
      navigationPresenter.back()

      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Home > homeLink')
      expect(navigationPresenter.viewModel.showBack).toBe(false)
      expect(navigationPresenter.viewModel.menuItems).toEqual([
        {
          id: 'booksLink',
          visibleName: 'Books'
        },
        {
          id: 'authorsLink',
          visibleName: 'Authors'
        }
      ])
    })
  })
})
