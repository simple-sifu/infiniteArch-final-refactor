import { injectable } from 'inversify'

@injectable()
class FakeRouterGateway {
  registerRoutes = async (routeConfig) => {}

  unload = () => {}

  goToId = async (routeId) => {}
}

export { FakeRouterGateway }
