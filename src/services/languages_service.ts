import languagesRepository, {
    CountInterface,
    SearchInterface,
} from '../repositories/languages_repository'

export default {
    async count(params: CountInterface) {
        return languagesRepository.count(params)
    },

    async index(params: SearchInterface) {
        return languagesRepository.findAll(params)
    },
}
