### AD prediction app

A simple application that uses cognitive and neuropsychological assessment scores to predict and visualize the current Alzheimer's disease (AD) state for a given individual.


#### How does it work
1. Enter the values for a given individual based on their current assessments.
2. Any missing values will be replaced by the **mean** of the samples the individual will be compared against.
3. Predict for the given patient and explore the visualization.


#### What does it do?

- Common AD testing metrics are entered for an individual.
- These metrics are used to derive a set of MRI datapoints using sample data that can be associated with that individual.
- The AD testing and MRI data are applied to a Machine-learning algorithm which predicts the current AD state for that given individual.
- The individual is compared against 564 anonymised sample patients (previously diagnosed with AD) using data collected by the [*Alzheimer's Disease Neuroimaging Initiative*](http://adni.loni.usc.edu/).
- The comparison is presented as a 3-D visualization, whereby the individual in question can be compared visually to an extensive network of previously diagnosed patients.


#### Why is it useful?

There were two fundamental reasons for building this application, both of which are aimed at providing another heuristic for diagnosising the disease:

- Accessbility: The diagnosis of AD is commonly dictated by carrying out cognitive and neuropsychological assessments (MMSE, CogState Brief Battery, etc.). However, there is a limited capacity for providing MRI scans for these patients and, then utlizing those scans for bettering their diagnosis. This application aims to mitigate some of these barriers by simulating MRI data for an individual.

- Simplicity: The more powerful component is the ability to visualize an individual in 3-D space relative to 564 previously diagnosed patients. By distilling all of these features for each inidividual into a simpler format, a patient can be compared easily, based on their position relative to another on the 3-D graph—*a picture paints a thousand words.*

**Example**

Using the figure below as an example (taken in-app). After undergoing cognitive assessments and evaluation, the clinician suggests that the patient shows early / mild signs of AD, however, once visualized in-app, we can see that the patient sits between individuals labelled with a more moderate and severe diagnosis.

This visualization may challenge the clinician's current views by offering them a different insight into the current state of the patient. To re-iterate, this visualization offers another tool in the clinicians toolbelt.

![demo](https://user-images.githubusercontent.com/45361366/148212307-90a0cc81-7511-4995-be6b-1a2a28e7103f.png)


#### Who is it for?
This app was built to be accessible to anyone that may find it useful—clinicians, researchers or anyone curious about AD.
