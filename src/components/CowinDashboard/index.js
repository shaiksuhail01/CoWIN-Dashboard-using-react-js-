import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VacccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    cowinData: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCovidDetails()
  }

  getCovidDetails = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const fetchedData = await response.json()
      this.setState({
        cowinData: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSwitch = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCovidDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      case apiStatusConstants.failure:
        return this.renderFailureResponse()

      default:
        return null
    }
  }

  renderCovidDetails = () => {
    const {cowinData} = this.state
    return (
      <>
        <VaccinationCoverage
          vaccinationDetails={cowinData.last_7_days_vaccination}
        />
        <VacccinationByGender genderDetails={cowinData.vaccination_by_gender} />
        <VaccinationByAge ageDetails={cowinData.vaccination_by_age} />
      </>
    )
  }

  renderLoading = () => (
    <div data-testid="loader" className="loaderContainer">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureResponse = () => (
    <div className="failureContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failureImage"
        alt="failure view"
      />
      <h1 className="failureText">Something went wrong</h1>
    </div>
  )

  render() {
    return (
      <div className="cowinDashboardContainer">
        <div className="logoContainer">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logoImage"
          />
          <p className="logoText">Co-WIN</p>
          <p className='logoText'>Co-dash</p>
        </div>
        <h1 className="heading">CoWIN Vaccination in India</h1>
        {this.renderSwitch()}
      </div>
    )
  }
}

export default CowinDashboard
