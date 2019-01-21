import React, { Component } from 'react'

import '../../styles/projects/styles.css'

import Genres from '../../images/genres.png'
import MobilePng from '../../images/mobile.png'
import MobileWeb from '../../images/mobile.webp'

class Mixtape extends Component {
  render() {
    return (
      <div className="ProjectView__Container-paxcuj-0 fRXRVr">
        <div className="ProjectContainer-s16s8y6k-0 kzFaUy">
          <div className="Project__ProjectWrapper-s1okt27x-0 dKLImk">
            <div className="SpacedContent-s13gt09q-0 fOyKUT">
              <div className="Container-ybirvx-0 eCMzjk">
                <div>
                  <div className="Grid__GridContainer-xhz9es-0 TSGqh">
                    <div className="Col-mbuk5t-0 bbCpmp"><h1 className="Text__InnerText-s1e82ayr-0-h1 ehFbfD" color="black">Mixtape Generator</h1>
                    </div>
                    <div className="Col-mbuk5t-0 bbCpmp">
                      <div className="Text__InnerText-s1e82ayr-0 lnEgyZ" color="onyx">A music recommendation system</div>
                    </div>
                  </div>
                </div>
              </div>                      
              <div className="Container-ybirvx-0 eCMzjk DescriptionInfo">
                <div>
                  <div className="Grid__GridContainer-xhz9es-0 TSGqh">
                    <div className="Col-mbuk5t-0 bselgP">
                      <h5 className="Text__InnerText-s1e82ayr-0-h5 dMflxW">Front-End</h5>
                      <div className="Text__InnerText-s1e82ayr-0 gquVkl"><span>React, <span>Redux</span></span></div>
                    </div>
                    <div className="Col-mbuk5t-0 bselgP">
                      <h5 className="Text__InnerText-s1e82ayr-0-h5 dMflxW">Time Duration</h5>
                      <div className="Text__InnerText-s1e82ayr-0 gquVkl"><span>4 weeks</span></div>
                    </div>
                    <div className="Col-mbuk5t-0 bselgP">
                      <h5 className="Text__InnerText-s1e82ayr-0-h5 dMflxW">Tags</h5>
                      <div className="Text__InnerText-s1e82ayr-0 gquVkl"><span>Machine Learning, <span><span>Network Analysis</span></span></span></div>
                    </div>
                    <div className="Col-mbuk5t-0 bselgP">
                      <h5 className="Text__InnerText-s1e82ayr-0-h5 dMflxW">Demo</h5>
                      <div className="Text__InnerText-s1e82ayr-0 gquVkl"><a href="https://surumen.github.io/mixtape/" target="_blank" rel="noopener noreferrer" className="sc-bdVaJa fhxAte">Create your Mixtape</a></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Container-ybirvx-0 eCMzjk">
                <div>
                  <div className="Grid__GridContainer-xhz9es-0 TSGqh">                                       
                    <div className="Col-mbuk5t-0 cZTvaB">
                      <div className="SpacedContent-s13gt09q-0 dTBSrq">
                        <h2 className="Text__InnerText-s1e82ayr-0-h2 laAsVU" color="black">The Problem</h2>
                        <p className="Text__InnerText-s1e82ayr-0-p buTjHe" color="onyx">Music catalogues for online retail have become immense over the past decades. Well-known artists and tracks make up a very small portion of this item space, which is known as the <a href="https://en.wikipedia.org/wiki/Long_tail" className="text-underline">Long tail phenomenon</a>.</p>
                        <p className="Text__InnerText-s1e82ayr-0-p buTjHe" color="onyx">As a result, finding new, interesting music has become a challenging task. Recommender systems try alleviate this problem by filtering the item repository based on a user’s music taste. One of the most common recommendation algorithm, <em>collaborative filtering</em>which is used by many streaming platforms like Spotify, uses an overlap of item sets of each user profile to find possible suggestions in the difference of these item sets. The problem with this approach is that sometimes a user can have their own unique tastes and mapping their profile to that of other not-so-similar users would result in song recommendations that would be a little uhm...off.</p>
                        <p className="Text__InnerText-s1e82ayr-0-p buTjHe" color="onyx">In this project, I apply a variation of the Content-based Filtering (CBF) method, by creating a network of one million similar songs, extracting the dominant clusters in the network and finally using a k-Nearest Neighbors classifier to make recommendations to a user.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mixtapegen">
                <div className="Container-ybirvx-0 eCMzjk">
                  <div className="SpacedContent-s13gt09q-0 lnGtDs">
                    <div>
                      <div className="Grid__GridContainer-xhz9es-0 jPVMSq">
                        <div className="Col-mbuk5t-0 bbCpmp">
                          <div className="BotsConnection__SVGWrapper-x0tx52-0 hBCYXv">
                            <picture>
                              <source srcSet={Genres} type="image/png" />
                              <img src={Genres} alt="PCA" />
                            </picture>
                          </div>
                        </div>
                        <div className="Col-mbuk5t-0 bbCpmp">
                          <div className="SpacedContent-s13gt09q-0 dTBSrq">
                            <h2 className="Text__InnerText-s1e82ayr-0-h2 cEFavV" color="white">Making Recommendations</h2>
                            <p className="Text__InnerText-s1e82ayr-0-p lfbaXs" color="white">I used data from the <a className="text-underline" href="https://labrosa.ee.columbia.edu/millionsong/">Million Song Dataset</a> which provides features for one million popular songs - loudness, danceability, energy, among other features. The first step involves constructing a feature profile for a single user. Features are all the tracks in the network of one million songs. We then normalize playcount for tracks in a user's play events by total playcounts for that user.</p>
                            <p className="Text__InnerText-s1e82ayr-0-p lfbaXs" color="white">The next steps involve constructing a Song-Genre boolean matrix where "genre" is one of the dominant clusters in the network of one millin songs. Finally, we construct a User-Genre matrix to determine the frequency of each Genre (cluster in the graph) in a user's play events and write that to a matrix which we use to run a dimensionality reduction algorithm to figure out the "micro-genres" that a user likes the most and use that to make recommendations to that user.</p>
                            <p className="Text__InnerText-s1e82ayr-0-p lfbaXs" color="white">The plot shows the result of running Principal Component Analysis on the profiles of 6 users whose listening data is available through the <a className="text-underline" href="https://labrosa.ee.columbia.edu/millionsong/tasteprofile">Echo Nest Taste Profiles dataset</a>.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Container-ybirvx-0 eCMzjk">
                <div>
                  <div className="Grid__GridContainer-xhz9es-0 TSGqh">
                    <div className="Col-mbuk5t-0 cZTvaB">
                      <div className="SpacedContent-s13gt09q-0 dTBSrq"><h2 className="Text__InnerText-s1e82ayr-0-h2 laAsVU" color="black">Demo</h2>
                        <p className="Text__InnerText-s1e82ayr-0-p buTjHe" color="onyx">At the moment the demo allows you to enter one Artist-Song tuple but the catch is it can only query songs that are available in the Million Song Dataset. It then generates a list of 50 nearest neighbors in the network where edges are weighted by the similarity measure between songs. You can then export your playlist to YouTube (support for Spotify and AppleMusic coming soon).</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="MobileBot__MobileBotContent-s1swm6tf-0 HjsyO">
                <div className="Container-ybirvx-0 eCMzjk">
                  <div className="Col-mbuk5t-0 exIOMq" />
                  <div className="MobileBot__AnimationParentCol-s1swm6tf-5 krDoML Col-mbuk5t-0 gukrFt">
                    <div>
                      <div className="MobileBot__MobilesWrap-s1swm6tf-1 dpMwzu">
                        <div className="MobileBot__MobileColumn-s1swm6tf-2 gnGujQ">
                          <div className="MobileBot__MobileImageWrap-s1swm6tf-3 fVvBVA">
                            <div className="MobileBot__MobileImage-s1swm6tf-4 irmtYt Image__Container-s1g7n88a-0 jWxtBA">
                              <picture>
                                <source srcSet={MobileWeb} type="image/webp" />
                                <source srcSet={MobilePng} type="image/png" />
                                <img src={MobilePng}/>
                                </picture>
                            </div>
                            <div className="MobileBot__VideoContainer-s1swm6tf-6 iAkeu">
                              <iframe src="https://player.vimeo.com/video/310848472" width={640} height={1151} frameBorder={0} webkitallowfullscreen mozallowfullscreen allowFullScreen className="MobileBot__VideoPlayer-s1swm6tf-7 kDAAWm" autoPlay loop playsInline muted />
                            </div>
                          </div>             
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Container-ybirvx-0 eCMzjk">
                <div className="Text__InnerText-s1e82ayr-0 cYscDA">
                  <div className="SpacedContent-s13gt09q-0 fUpIDI">
                    <div>
                      <a className="ProjectFooter__LetsChatButton-s5zckki-0 fGHVwo sc-bwzfXH dOhQhq" href="/">
                        <div className="Button__ButtonContent-s1ov6wwx-0 jnPIJs" format="outline">Back to All Projects</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>      
      </div>
    )
  }
}

export default Mixtape

